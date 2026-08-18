// Read the newest message to an address from an IMAP mailbox. Just enough IMAP over TLS
// to find a link in an auth email; nothing more.
//
// ponytail: ~60 lines of raw IMAP rather than a dependency this repo has no package.json
// for. Handles LOGIN, SELECT INBOX, SEARCH TO, FETCH BODY[TEXT]. Add UID/IDLE if a
// suite ever needs to wait for mail rather than poll.
//
// Config, from .env.e2e (gitignored):
//   E2E_IMAP_HOST  E2E_IMAP_USER  E2E_IMAP_PASSWORD  [E2E_IMAP_PORT=993]
// Any mailbox works: a Gmail app password, Fastmail, a Resend inbound route to IMAP.

import tls from "node:tls";

const q = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export function mailboxConfigured(env = process.env) {
  return Boolean(env.E2E_IMAP_HOST && env.E2E_IMAP_USER && env.E2E_IMAP_PASSWORD);
}

// A response is complete when its tagged status line arrives OUTSIDE any literal.
// IMAP literals are announced as {N}\r\n and carry N bytes; a mail body that happens
// to contain a line "A1 OK …" must not end the FETCH early. Text is treated as one byte
// per char: auth mails are ASCII, and this file says so.
export function responseComplete(text, t) {
  let i = 0;
  const tagged = new RegExp(`^${t} (OK|NO|BAD)`);
  while (i < text.length) {
    const nl = text.indexOf("\r\n", i);
    if (nl === -1) return null;
    const line = text.slice(i, nl);
    if (tagged.test(line)) return line;
    const lit = line.match(/\{(\d+)\}$/);
    i = nl + 2 + (lit ? Number(lit[1]) : 0);
  }
  return null;
}

function imapSession({ host, port = 993, user, password }) {
  return new Promise((resolve, reject) => {
    const sock = tls.connect({ host, port, servername: host }, () => resolve(client));
    sock.setEncoding("utf8");
    sock.on("error", reject);
    let buf = "";
    let tag = 0;
    let waiter = null;
    sock.on("data", (d) => {
      buf += d;
      if (!waiter) return;
      const status = responseComplete(buf, waiter.tag);
      if (!status) return;
      const out = buf; buf = "";
      const w = waiter; waiter = null;
      /^\S+ (NO|BAD)/.test(status) ? w.reject(new Error(status)) : w.resolve(out);
    });
    const client = {
      cmd(line) {
        const t = `A${++tag}`;
        return new Promise((res, rej) => { waiter = { tag: t, resolve: res, reject: rej }; sock.write(`${t} ${line}\r\n`); });
      },
      close() { sock.end(); },
      // IMAP quoted-string: backslash and double-quote are the two escapable bytes,
      // and backslash must be escaped first or it double-escapes the quote's escape.
      login: () => client.cmd(`LOGIN "${q(user)}" "${q(password)}"`),
    };
  });
}

// Newest message addressed to `to` whose body matches `bodyPattern` (optional).
// Returns { text } or null. Polls up to `timeoutMs`.
export async function newestMessage({ to, bodyPattern, timeoutMs = 90_000, sinceMs = Date.now() - 5 * 60_000 }, env = process.env) {
  const cfg = { host: env.E2E_IMAP_HOST, port: Number(env.E2E_IMAP_PORT || 993), user: env.E2E_IMAP_USER, password: env.E2E_IMAP_PASSWORD };
  const deadline = Date.now() + timeoutMs;
  const since = new Date(sinceMs);
  const imapDate = `${since.getUTCDate()}-${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][since.getUTCMonth()]}-${since.getUTCFullYear()}`;
  while (Date.now() < deadline) {
    const c = await imapSession(cfg);
    try {
      await c.login();
      await c.cmd("SELECT INBOX");
      const search = await c.cmd(`SEARCH TO "${to}" SINCE ${imapDate}`);
      const ids = (search.match(/^\* SEARCH(.*)$/m) || [, ""])[1].trim().split(/\s+/).filter(Boolean).map(Number);
      for (const id of ids.reverse()) {
        const raw = await c.cmd(`FETCH ${id} BODY.PEEK[TEXT]`);
        // Quoted-printable: soft breaks first, then hex escapes (either case). Auth mails
        // are ASCII links, so byte-wise decode is enough; no UTF-8 reassembly needed.
        const text = raw.replace(/=\r?\n/g, "").replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
        if (!bodyPattern || bodyPattern.test(text)) return { text };
      }
    } finally { c.close(); }
    await new Promise((r) => setTimeout(r, 5000));
  }
  return null;
}

export function firstLink(text, hostPattern) {
  const links = [...text.matchAll(/https?:\/\/[^\s"'<>)\]]+/g)].map((m) => m[0]);
  return links.find((l) => hostPattern.test(l)) || null;
}

// Self-check: the literal-aware completion detector. node tests/lib/mailbox.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const assert = (await import("node:assert/strict")).default;
  const body = "Hello\r\nA1 OK looks like a status but is body\r\nbye\r\n";
  const resp = `* 1 FETCH (BODY[TEXT] {${body.length}}\r\n${body})\r\nA1 OK FETCH done\r\n`;
  assert.equal(responseComplete(resp, "A1"), "A1 OK FETCH done", "literal containing 'A1 OK' ended the response early");
  assert.equal(responseComplete(resp.slice(0, 40), "A1"), null, "incomplete literal reported complete");
  assert.equal(responseComplete("A2 NO [AUTHENTICATIONFAILED] bad\r\n", "A2"), "A2 NO [AUTHENTICATIONFAILED] bad");
  assert.equal(responseComplete("* SEARCH 4 7\r\nA3 OK SEARCH\r\n", "A3"), "A3 OK SEARCH");
  assert.equal(q('a"b\\c'), 'a\\"b\\\\c', "quoted-string escaping");
  console.log("mailbox: literal-aware completion 4 cases + quoting pass");
}
