// Enrols a TOTP factor for an existing account and prints the secret for .env.e2e.
//
//   node scripts/e2e-enrol-totp.mjs staff@example.com 'the-password'
//
// Every portal role needs aal2 (portal.js), and a browser test cannot read an
// authenticator app, so the suite holds the secret instead. This uses nothing but the
// account's own password and the publishable key — no service key, no admin API — so it
// is exactly what the account holder could do themselves.
//
// Whoever completes an enrolment holds that authenticator. Run this only for accounts
// created for the test suite, never for a real person's account.

import { totp } from "../tests/lib/totp.mjs";

const SB_URL = "https://hanjrsslhnuauaysbhun.supabase.co";
const SB_ANON = "sb_publishable_wtK-KC8ibXtA0EvVIJZGqA_oY8wx_6E";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("usage: node scripts/e2e-enrol-totp.mjs <email> <password>");
  process.exit(2);
}

const api = async (path, { method = "POST", token, body } = {}) => {
  const res = await fetch(SB_URL + path, {
    method,
    headers: {
      apikey: SB_ANON,
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 300)}`);
  return json;
};

const auth = await api("/auth/v1/token?grant_type=password", { body: { email, password } });
const token = auth.access_token;

const existing = await api("/auth/v1/factors", { method: "GET", token }).catch(() => null);
const factors = (existing && (existing.totp || existing.all || existing)) || [];
if (Array.isArray(factors) && factors.some((f) => f.status === "verified")) {
  console.error(
    "this account already has a verified TOTP factor. Its secret was shown only at " +
      "enrolment, so either use the stored secret or unenrol that factor first."
  );
  process.exit(1);
}

const factor = await api("/auth/v1/factors", {
  token,
  body: { factor_type: "totp", friendly_name: `e2e-${Date.now()}`, issuer: "Attest AI" },
});
const secret = factor.totp.secret;

const challenge = await api(`/auth/v1/factors/${factor.id}/challenge`, { token });
await api(`/auth/v1/factors/${factor.id}/verify`, {
  token,
  body: { challenge_id: challenge.id, code: totp(secret) },
});

console.log(`\nenrolled. Add to .env.e2e:\n`);
const prefix = process.env.E2E_PREFIX || "E2E_ACCOUNT";
console.log(`${prefix}_EMAIL=${email}`);
console.log(`${prefix}_PASSWORD=${password}`);
console.log(`${prefix}_TOTP_SECRET=${secret}\n`);
