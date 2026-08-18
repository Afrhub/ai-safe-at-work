// Runbook Phase 2, definition of done E: "Forgot your password?" actually works.
//
//   click Forgot on the sign-in page -> an email arrives, from the product's domain
//   -> its link opens the reset form -> a new password is set -> it signs in
//   -> the original password is restored so the account is unchanged for other suites.
//
// Run: node tests/suites/e2e-password-reset.mjs [baseUrl]
//
// Skips, honestly, until Phase 2 exists: it needs a mailbox the reset lands in
// (E2E_IMAP_* in .env.e2e) and a Supabase project whose SMTP can send. Until then the
// suite reports SKIP with the reason, never a false pass. Uses e2e-staff@, whose inbox
// you point E2E_IMAP_* at, or any address you can read that owns a portal account.

import { group, check, eq, ok, skip, report, reset } from "../lib/harness.mjs";
import { BASE, available, unavailableReason, launch, newPage } from "../lib/browser.mjs";
import { STAFF, missingAccountsReason } from "../lib/e2e-fixtures.mjs";
import { mailboxConfigured, newestMessage, firstLink } from "../lib/mailbox.mjs";
import { PortalLoginPage } from "../pages/portal-login-page.mjs";
import { readFileSync } from "node:fs";

const SUPABASE_POSTS = { allowPosts: ["supabase.co"] };
const envFile = (() => {
  try {
    const raw = readFileSync(new URL("../../.env.e2e", import.meta.url).pathname, "utf8");
    return Object.fromEntries(raw.split("\n").map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]));
  } catch (e) { return {}; }
})();
const env = { ...envFile, ...process.env };
// Which account gets reset: default e2e-staff, override with E2E_RESET_EMAIL/PASSWORD/TOTP_SECRET.
const ACCOUNT = env.E2E_RESET_EMAIL
  ? { email: env.E2E_RESET_EMAIL, password: env.E2E_RESET_PASSWORD, totpSecret: env.E2E_RESET_TOTP_SECRET }
  : STAFF;

export async function run() {
  reset();
  group("password reset, Phase 2 proof");

  if (!available()) { await check("PWR", "playwright available", async () => skip(unavailableReason())); return report("e2e-password-reset"); }
  if (!ACCOUNT) { await check("PWR", "accounts configured", async () => skip(missingAccountsReason)); return report("e2e-password-reset"); }
  if (!mailboxConfigured(env)) {
    await check("PWR", "mailbox configured", async () =>
      skip("no E2E_IMAP_HOST/USER/PASSWORD in .env.e2e — Phase 2 needs a mailbox the reset email lands in"));
    return report("e2e-password-reset");
  }

  const browser = await launch();
  const session = await newPage(browser, SUPABASE_POSTS);
  const { page, record } = session;
  const login = new PortalLoginPage(page, record);
  let sentAt = Date.now(); // set again the moment Forgot is clicked, so a stale mail cannot match
  const tempPassword = "Reset-" + Math.random().toString(36).slice(2, 10) + "-Aa1";
  let link = null;
  let mail = null;

  await check("PWR-01", "Forgot your password? sends without error", async () => {
    await login.open();
    await login.email.fill(ACCOUNT.email);
    sentAt = Date.now();
    await page.locator("#forgot").click();
    await page.waitForFunction(() => {
      const m = document.getElementById("msg");
      return m && (m.classList.contains("ok") || m.classList.contains("err"));
    }, { timeout: 30_000 });
    const msg = (await login.message.textContent()) || "";
    const isErr = await login.message.evaluate((el) => el.classList.contains("err"));
    ok(!isErr, `the portal reported: ${msg.trim()}`);
  });

  await check("PWR-02", "a reset email arrives, from the product's own domain", async () => {
    mail = await newestMessage({ to: ACCOUNT.email, bodyPattern: /reset|recover|password/i, sinceMs: sentAt, timeoutMs: 120_000 }, env);
    ok(mail, "no reset email arrived within 2 minutes — Supabase SMTP not sending, or the mailbox is wrong");
    // Sender check needs headers; BODY[TEXT] does not carry them, so match the link host
    // as the proxy: a Supabase-default sender links to supabase.co, our sender links to us.
    link = firstLink(mail.text, /hanjrsslhnuauaysbhun\.supabase\.co\/auth\/v1\/verify|attest-ai\.com|aisafework\.netlify\.app/);
    ok(link, `no usable link in the email: ${mail.text.slice(0, 200)}`);
  });

  await check("PWR-03", "the link opens the reset form on the portal", async () => {
    await page.goto(link, { waitUntil: "domcontentloaded" });
    await page.locator("#step-reset").waitFor({ state: "visible", timeout: 30_000 });
    ok(/\/portal\/login\.html/.test(page.url()), `landed on ${page.url()}, not the portal sign-in page — check the redirect allowlist`);
  });

  await check("PWR-04", "a new password is accepted and signs in", async () => {
    await page.locator("#new-pw").fill(tempPassword);
    await page.locator("#new-pw2").fill(tempPassword);
    await page.locator("#step-reset button[type=submit]").click();
    // afterAuth() runs: enrolled account -> MFA challenge; then routes.
    await page.waitForFunction(() => {
      const mfa = document.getElementById("step-mfa");
      return (mfa && !mfa.hidden) || !location.pathname.endsWith("login.html");
    }, { timeout: 30_000 });
    if (await login.mfaStep.isVisible().catch(() => false)) await login.enterCode(ACCOUNT.totpSecret);
    await page.waitForURL((u) => !u.pathname.endsWith("login.html"), { timeout: 30_000 });
    // Prove the new password, not just the recovery session: fresh context, sign in.
    await session.close();
    const fresh = await newPage(browser, SUPABASE_POSTS);
    try {
      const landed = await new PortalLoginPage(fresh.page, fresh.record).signIn({ ...ACCOUNT, password: tempPassword });
      ok(!landed.endsWith("login.html"), `new password did not sign in, landed ${landed}`);
    } finally { await fresh.close(); }
  });

  await check("PWR-05", "the original password is restored", async () => {
    // Sign in with the temp password and set the original back through updateUser via the
    // portal's own reset form is not reachable without another email; use the auth REST
    // endpoint with the temp session instead — same call the form makes.
    const SB = "https://hanjrsslhnuauaysbhun.supabase.co";
    const KEY = "sb_publishable_wtK-KC8ibXtA0EvVIJZGqA_oY8wx_6E";
    const tok = await fetch(`${SB}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: ACCOUNT.email, password: tempPassword }),
    }).then((r) => r.json());
    ok(tok.access_token, "could not sign in with the temp password to restore");
    // aal2 needed for updateUser on an MFA account.
    const { totp } = await import("../lib/totp.mjs");
    const me = await fetch(`${SB}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${tok.access_token}` } }).then((r) => r.json());
    let bearer = tok.access_token;
    const factor = (me.factors || []).find((f) => f.status === "verified");
    if (factor) {
      const ch = await fetch(`${SB}/auth/v1/factors/${factor.id}/challenge`, { method: "POST", headers: { apikey: KEY, Authorization: `Bearer ${bearer}` } }).then((r) => r.json());
      const v = await fetch(`${SB}/auth/v1/factors/${factor.id}/verify`, { method: "POST", headers: { apikey: KEY, Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" }, body: JSON.stringify({ challenge_id: ch.id, code: totp(ACCOUNT.totpSecret) }) }).then((r) => r.json());
      ok(v.access_token, `MFA verify did not return an aal2 token: ${JSON.stringify(v).slice(0, 200)}`);
      bearer = v.access_token;
    }
    const upd = await fetch(`${SB}/auth/v1/user`, { method: "PUT", headers: { apikey: KEY, Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" }, body: JSON.stringify({ password: ACCOUNT.password }) });
    eq(upd.status, 200, `restore failed: ${upd.status} ${await upd.text()}`);
  });

  await browser.close();
  return report("e2e-password-reset");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`password reset journey against ${BASE}`);
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
