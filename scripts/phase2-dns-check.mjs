// Runbook Phase 1 + 2 verifier: is attest-ai.com pointing at Netlify, and does it carry
// the mail-auth records Resend needs? Zero dependencies, runs from anywhere.
//
//   node scripts/phase2-dns-check.mjs
//   node scripts/phase2-dns-check.mjs --dkim-selector resend   (default: resend)
//
// Exit 0 when every check passes, 1 otherwise. Re-run after each DNS change; propagation
// is minutes to an hour, so a fail right after a change is normal.

import { promises as dns } from "node:dns";

const DOMAIN = "attest-ai.com";
const NETLIFY_HOST = "aisafework.netlify.app";
const args = process.argv.slice(2);
const selector = args.includes("--dkim-selector") ? args[args.indexOf("--dkim-selector") + 1] : "resend";

// Resend also uses a bounce/return-path subdomain in some setups; informational only.
const results = [];
const check = (id, title, pass, detail) => {
  results.push({ id, title, pass, detail });
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${id.padEnd(9)} ${title}${detail ? `\n          ${detail}` : ""}`);
};

const txt = async (name) => {
  try { return (await dns.resolveTxt(name)).map((r) => r.join("")); } catch (e) { return []; }
};
const a = async (name) => { try { return await dns.resolve4(name); } catch (e) { return []; } };
const cname = async (name) => { try { return await dns.resolveCname(name); } catch (e) { return []; } };
const ns = async (name) => { try { return await dns.resolveNs(name); } catch (e) { return []; } };

console.log(`\nDNS check for ${DOMAIN}\n`);

// ── Phase 1: the domain points at Netlify ────────────────────────────────────
console.log("Phase 1, domain at Netlify");
const nameservers = await ns(DOMAIN);
console.log(`          nameservers: ${nameservers.join(", ") || "(none)"}`);

const netlifyIps = await a(NETLIFY_HOST);
const apexIps = await a(DOMAIN);
const apexOnNetlify = apexIps.some((ip) => netlifyIps.includes(ip)) ||
  apexIps.some((ip) => ip.startsWith("75.2.") || ip.startsWith("99.83."));
check("P1-A", "apex A record points at Netlify",
  apexIps.length > 0 && apexOnNetlify,
  `apex -> ${apexIps.join(", ") || "(none)"}; ${NETLIFY_HOST} -> ${netlifyIps.join(", ") || "(none)"}`);

const wwwC = await cname(`www.${DOMAIN}`);
const wwwA = await a(`www.${DOMAIN}`);
const wwwOk = wwwC.some((c) => c.replace(/\.$/, "") === NETLIFY_HOST) ||
  wwwA.some((ip) => netlifyIps.includes(ip));
check("P1-B", "www points at Netlify",
  wwwOk,
  `www -> CNAME ${wwwC.join(", ") || "(none)"} / A ${wwwA.join(", ") || "(none)"}`);

let https = null;
try {
  const r = await fetch(`https://${DOMAIN}/`, { redirect: "manual" });
  https = { status: r.status, server: r.headers.get("server") || "", location: r.headers.get("location") || "" };
} catch (e) { https = { error: e.message }; }
check("P1-C", "https://attest-ai.com/ is served by Netlify",
  https && !https.error && /netlify/i.test(https.server),
  https ? JSON.stringify(https) : "");

// ── Phase 2: mail authentication for Resend ─────────────────────────────────
console.log("\nPhase 2, mail authentication");
const spf = (await txt(DOMAIN)).filter((t) => /^v=spf1/i.test(t));
// Resend sends through Amazon SES, so its SPF include is amazonses.com, not "resend".
// Some Resend setups put SPF on the send.<domain> subdomain instead; check both.
const spfHosts = { [DOMAIN]: spf, [`send.${DOMAIN}`]: (await txt(`send.${DOMAIN}`)).filter((t) => /^v=spf1/i.test(t)) };
const spfHit = Object.entries(spfHosts).find(([, recs]) => recs.some((t) => /include:amazonses\.com/i.test(t)));
check("P2-SPF", "SPF record includes amazonses.com (Resend's sender)",
  Boolean(spfHit) && spfHit[1].length === 1,
  spfHit ? `${spfHit[0]}: ${spfHit[1].join(" | ")}` :
    `apex: ${spf.join(" | ") || "(no v=spf1)"}; send.: ${spfHosts[`send.${DOMAIN}`].join(" | ") || "(no v=spf1)"}` +
    (spf.length > 1 ? " — MORE THAN ONE SPF RECORD at apex, only one is allowed" : ""));

const dkimName = `${selector}._domainkey.${DOMAIN}`;
const dkim = await txt(dkimName);
check("P2-DKIM", `DKIM key at ${dkimName}`,
  dkim.some((t) => /p=/.test(t)),
  dkim.length ? `${dkim[0].slice(0, 60)}…` : "(none) — Resend shows the exact selector on its Domains page; pass --dkim-selector if it differs");

const dmarc = await txt(`_dmarc.${DOMAIN}`);
check("P2-DMARC", "DMARC policy present",
  dmarc.some((t) => /^v=DMARC1/i.test(t)),
  dmarc.length ? dmarc.join(" | ") : "(none) — Resend suggests one; p=none is fine to start");

// Resend also uses a bounce/return-path subdomain in some setups; informational only.
const send = await cname(`send.${DOMAIN}`);
if (send.length) console.log(`          info: send.${DOMAIN} -> ${send.join(", ")}`);

const mx = await (async () => { try { return await dns.resolveMx(DOMAIN); } catch (e) { return []; } })();
console.log(`          info: MX ${mx.length ? mx.map((m) => m.exchange).join(", ") : "(none — fine for send-only; needed only if you want to RECEIVE at attest-ai.com)"}`);

// ── Summary ─────────────────────────────────────────────────────────────────
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks pass.`);
if (failed.length) {
  console.log("Still to do:");
  for (const f of failed) console.log(`  - ${f.id}: ${f.title}`);
}
process.exit(failed.length ? 1 : 0);
