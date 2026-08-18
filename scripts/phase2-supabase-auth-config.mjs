// Runbook Phase 2, steps 7–9 in one command: point Supabase Auth at Resend SMTP, raise
// the email rate limit, and allow the attest-ai.com portal as a redirect target.
//
// Needs, via env (never committed, never in .env.e2e):
//   SUPABASE_ACCESS_TOKEN   Supabase dashboard → Account → Access Tokens → generate
//   RESEND_SMTP_PASSWORD    Resend → API Keys (Resend's SMTP password IS an API key, re_…)
// Optional:
//   SMTP_SENDER             default no-reply@attest-ai.com
//   SMTP_SENDER_NAME        default "Attest AI"
//   AUTH_EMAILS_PER_HOUR    default 30
//   --dry-run               show the diff, change nothing
//
//   SUPABASE_ACCESS_TOKEN=sbp_… RESEND_SMTP_PASSWORD=re_… node scripts/phase2-supabase-auth-config.mjs
//
// Idempotent: reads current config, prints what would change, applies only the diff.
// Refuses to run without the token. Uses the Management API only, no service key.
// Field names verified 18 Aug 2026 against api.supabase.com/api/v1-json UpdateAuthConfigBody.

const PROJECT = "hanjrsslhnuauaysbhun";
const API = `https://api.supabase.com/v1/projects/${PROJECT}/config/auth`;

const token = process.env.SUPABASE_ACCESS_TOKEN;
const smtpPass = process.env.RESEND_SMTP_PASSWORD;
const dryRun = process.argv.includes("--dry-run");

if (!token) {
  console.error("SUPABASE_ACCESS_TOKEN is not set. Supabase dashboard → Account → Access Tokens.");
  process.exit(2);
}

const desired = {
  // Step 7: Resend SMTP. Host/port/user are Resend's fixed values.
  external_email_enabled: true,
  smtp_admin_email: process.env.SMTP_SENDER || "no-reply@attest-ai.com",
  smtp_sender_name: process.env.SMTP_SENDER_NAME || "Attest AI",
  smtp_host: "smtp.resend.com",
  smtp_port: 465,
  smtp_user: "resend",
  ...(smtpPass ? { smtp_pass: smtpPass } : {}),
  // Seconds between emails to the same address. Default 60 makes "resend the invite"
  // silently fail for a minute; 10 keeps that usable without becoming a flood vector.
  smtp_max_frequency: 10,

  // Step 8: rate limit. Default 2/h shares invites and resets and hit us on 8 Jul 2026.
  rate_limit_email_sent: Number(process.env.AUTH_EMAILS_PER_HOUR || 30),
};

// Step 9: redirect allowlist — additive, keep whatever is there.
const REDIRECTS_TO_ADD = [
  "https://attest-ai.com/portal/login.html",
  "https://www.attest-ai.com/portal/login.html",
  "https://aisafework.netlify.app/portal/login.html",
];

const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const current = await fetch(API, { headers }).then(async (r) => {
  if (!r.ok) throw new Error(`GET auth config -> ${r.status} ${await r.text()}`);
  return r.json();
});

const patch = {};
const report = [];
for (const [k, v] of Object.entries(desired)) {
  const cur = current[k];
  const same = k === "smtp_pass" ? false : String(cur) === String(v);
  if (!same) {
    patch[k] = v;
    report.push(`  ${k}: ${k === "smtp_pass" ? "(set)" : JSON.stringify(cur)} -> ${k === "smtp_pass" ? "(new value)" : JSON.stringify(v)}`);
  }
}

const currentRedirects = (current.uri_allow_list || "").split(",").map((s) => s.trim()).filter(Boolean);
const missing = REDIRECTS_TO_ADD.filter((u) => !currentRedirects.includes(u));
if (missing.length) {
  patch.uri_allow_list = [...currentRedirects, ...missing].join(",");
  report.push(`  uri_allow_list: + ${missing.join(", ")}`);
}
if (!current.site_url || /netlify\.app/.test(current.site_url)) {
  // Only move site_url once the domain is really live; until then, keep netlify.app.
  report.push(`  (site_url is ${JSON.stringify(current.site_url)} — leave until Phase 1 is done, then set to https://attest-ai.com)`);
}

if (!smtpPass) {
  report.push("  (RESEND_SMTP_PASSWORD not set — SMTP host/user/sender configured, password left as-is)");
}

console.log(`Supabase Auth config for ${PROJECT}\n`);
if (!report.length) { console.log("Already matches. Nothing to do."); process.exit(0); }
console.log(dryRun ? "Would change:" : "Changing:");
console.log(report.join("\n"));

if (dryRun) { console.log("\n--dry-run: nothing applied."); process.exit(0); }
if (!Object.keys(patch).length) process.exit(0);

const res = await fetch(API, { method: "PATCH", headers, body: JSON.stringify(patch) });
if (!res.ok) { console.error(`\nPATCH failed -> ${res.status} ${await res.text()}`); process.exit(1); }
console.log("\nApplied. Verify: send yourself a password reset from the portal sign-in page.");
