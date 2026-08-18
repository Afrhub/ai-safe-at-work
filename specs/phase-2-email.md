# Spec — Runbook Phase 2: email

Written 18 Aug 2026. Objective: invites, magic links and password resets **deliver**, from
the product's own domain, and the portal is reachable at that domain for the redirect.

## Ground truth at spec time (measured, not assumed)

- `attest-ai.com` nameservers are `ns43/ns44.domaincontrol.com` = **GoDaddy**, not 123-Reg
  as HANDOFF and the runbook say. A records `13.248.213.45 / 76.223.67.189` = parking.
  No TXT, no MX. **Phase 1 has not started**; DNS is where the domain actually is.
- Netlify site `89ac5015-…` primary URL is still `aisafework.netlify.app`; no custom domain
  attached. Netlify MCP has no domain/DNS operation, so Phase 1 stays 🧑.
- No Resend account or API key exists anywhere reachable (env, repo, keychain-visible).
- Supabase project `hanjrsslhnuauaysbhun` reachable via MCP for SQL only; auth config
  (SMTP, rate limits, redirect URLs) is dashboard/Management-API, needs your login.
- Portal redirect list, SMTP and rate limit are all still defaults.

## What Phase 2 must produce (definition of done)

| # | Outcome | Testable proof |
|---|---|---|
| A | `attest-ai.com` DNS carries Resend SPF + DKIM + DMARC, Resend shows Verified | `dig TXT attest-ai.com` shows SPF; `dig TXT resend._domainkey.attest-ai.com` (or Resend's selector) shows DKIM; `dig TXT _dmarc.attest-ai.com` shows a policy |
| B | Supabase Auth uses Resend SMTP, sender on the domain | password-reset for a test account produces a message with `From: *@attest-ai.com` |
| C | Auth email rate limit raised above 2/h | Supabase Auth settings show the new value; two resets in a minute both send |
| D | `https://attest-ai.com/portal/login.html` is in the redirect allowlist (netlify.app kept) | reset link lands on the reset form at that URL, not an error |
| E | End-to-end: "Forgot your password?" → email arrives → link opens reset form → new password signs in | automated: `tests/suites/e2e-password-reset.mjs` (see below) |

## Dependency

**A depends on Phase 1** (domain at Netlify + records at the registrar). Nothing in B–E can
be *proven* end to end until A is real, because Supabase will refuse to send via an
unverified sender. B, C, D can be *configured* first and will light up when A lands.

## Split — machine-doable vs human-only

**🤖 buildable now (no credentials needed):**
1. `tests/suites/e2e-password-reset.mjs` — drives "Forgot your password?" in the browser
   for `e2e-staff@`, then reads the message from a **Resend inbound/test mailbox** or an
   IMAP box named in `.env.e2e`, follows the link, sets a new password, signs in with it,
   restores the original. Skips cleanly when no mailbox is configured. This is the E proof.
2. `scripts/phase2-dns-check.mjs` — the A/D verifier: digs SPF/DKIM/DMARC and the Netlify
   A/CNAME, prints pass/fail per record. Zero dependencies. Runs from anywhere.
3. `scripts/phase2-supabase-auth-config.mjs` — applies B, C, D via the Supabase Management
   API in one shot **when given** `SUPABASE_ACCESS_TOKEN` + Resend SMTP credentials via env.
   Idempotent, prints the diff, refuses without the token. Turns three dashboard screens
   into one command you run once.
4. Docs corrected: registrar is GoDaddy (HANDOFF, runbook, DOCTRINE all say 123-Reg).

**🧑 human-only, in order (each ~5 min):**
1. **Phase 1**: Netlify → Domain management → add `attest-ai.com` + `www` → GoDaddy DNS:
   A `@` → Netlify's IP (shown in Netlify), CNAME `www` → `aisafework.netlify.app` →
   wait for cert → set primary.
2. **Resend**: create account → Domains → add `attest-ai.com` → copy its 3–4 records into
   GoDaddy → wait for Verified. Create an API key + SMTP credentials.
3. **Supabase**: Settings → Access Tokens → create one. Then run script 3 with the token +
   Resend SMTP creds. (Or click through Auth → SMTP / Rate limits / URL config by hand.)
4. Run `node scripts/phase2-dns-check.mjs` until green, then the reset suite.

## Out of scope

Stripe, forms, JC's invite (Phases 3–5). Transcribing `invite-seat` (separate ticket, but
it is the function that will *use* this SMTP — do it before Phase 5).
