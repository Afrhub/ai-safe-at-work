# Phase 2 worksheet — the human clicks, in order, copy-paste ready

Written 18 Aug 2026 evening. Everything a machine could do for Phase 2 is done and
committed (`5bb88ff`). What remains is five gates that need **your** logins. Each one
below is a single screen with the exact values. After each, run the checker:

```bash
node scripts/phase2-dns-check.mjs
```

It tells you which record has landed and which has not. Total hands-on time ~25 min plus
DNS propagation waits.

---

## Gate 1 — Netlify: attach the domain (1 min)

**Why first:** Netlify has to be watching for the domain before DNS points at it, or the
certificate never provisions.

1. https://app.netlify.com/projects/aisafework/domain-management
2. **Add a domain** → `attest-ai.com` → Verify → Add. Accept `www.attest-ai.com` too.
3. Netlify will show "Awaiting external DNS" and list what it wants. It should match Gate 2
   below; if it shows a *different* IP, use Netlify's.

(A Netlify personal token on this Mac can do this via API — the agent was denied
permission to run it. `netlify` CLI is not installed; the token lives in
`~/Library/Preferences/netlify/config.json` if you want to script it yourself.)

## Gate 2 — GoDaddy: point the domain at Netlify (3 min + wait)

**Verified today:** nameservers are `ns43/ns44.domaincontrol.com` = GoDaddy. Netlify's
apex load balancer resolves to `75.2.60.5` and `99.83.231.61` (dig'd from
`apex-loadbalancer.netlify.com` tonight).

GoDaddy → My Products → attest-ai.com → **DNS** → Manage DNS:

| Type | Name | Value | Action |
|---|---|---|---|
| A | `@` | `75.2.60.5` | **Edit** the existing parking `A @` (currently `13.248.213.45` / `76.223.67.189`). If there are two `A @` rows, delete one, edit the other. **One only.** |
| CNAME | `www` | `aisafework.netlify.app` | **Edit** existing `www` (currently → `attest-ai.com`) |
| TXT | `_dmarc` | *(leave — GoDaddy's default is fine for now)* | keep |
| everything else | | | leave |

Wait 5–15 min. Then:
```bash
node scripts/phase2-dns-check.mjs     # P1-A, P1-B should flip to PASS
```
Back in Netlify: HTTPS certificate provisions on its own (minutes to ~1 h) → **Options →
Set as primary domain**. `P1-C` passes when `https://attest-ai.com` serves via Netlify.

## Gate 3 — Resend: the sender (5 min + wait)

1. https://resend.com → sign up (the free tier covers auth mail comfortably).
2. **Domains → Add domain** → `attest-ai.com` → region EU (Ireland) if offered.
3. Resend shows **3–4 records**. Add each at GoDaddy DNS exactly as shown. They look like:

| Type | Name (as Resend shows) | Value (as Resend shows) |
|---|---|---|
| TXT | `resend._domainkey` *(selector may differ — use theirs)* | `p=MIGf…` DKIM key |
| TXT | `send` *(or `@`)* | `v=spf1 include:amazonses.com ~all` |
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` priority 10 |
| TXT | `_dmarc` | `v=DMARC1; p=none;` — **only if GoDaddy's default isn't there; don't add a second** |

4. Wait, click **Verify** in Resend until every record is green.
5. **API Keys → Create** → name `supabase-auth` → permission **Sending access** → copy the
   `re_…` key once. That key is also the SMTP password.

```bash
node scripts/phase2-dns-check.mjs --dkim-selector <resend's selector>   # P2-* should PASS
```

## Gate 4 — Supabase: point auth at Resend (2 min, one command)

1. https://supabase.com/dashboard/account/tokens → **Generate new token** → name `phase2` →
   copy the `sbp_…` value once.
2. In the repo:

```bash
cd ~/projects/ai-safe-at-work
SUPABASE_ACCESS_TOKEN=sbp_… RESEND_SMTP_PASSWORD=re_… node scripts/phase2-supabase-auth-config.mjs --dry-run
```
Read the diff (Resend SMTP host/user/sender, rate limit 2→30/h, three redirect URLs). Then
drop `--dry-run` and run it once. Revoke the `sbp_` token afterwards if you like; it is
not stored anywhere.

That single run replaces runbook steps 7, 8 and 9.

## Gate 5 — prove it (2 min)

Point the reset-journey suite at any mailbox you can read via IMAP (a Gmail app password
works; the account being reset must be one whose email lands there — set
`E2E_RESET_EMAIL/PASSWORD/TOTP_SECRET` to such an account, or forward `e2e-staff@` mail
into it):

```
# .env.e2e (gitignored) — add:
E2E_IMAP_HOST=imap.gmail.com
E2E_IMAP_USER=you@gmail.com
E2E_IMAP_PASSWORD=<app password>
E2E_RESET_EMAIL=you+attest@gmail.com        # a portal account whose mail hits that inbox
E2E_RESET_PASSWORD=…
E2E_RESET_TOTP_SECRET=…                     # from scripts/e2e-enrol-totp.mjs
```
```bash
node tests/suites/e2e-password-reset.mjs
```
Five checks: reset sent → email arrives → link opens reset form → new password signs in →
original restored. Green = Phase 2 done, and every future customer's password reset works.

---

**After all five:** tell the agent. It re-runs the whole board (`node tests/run-all.mjs`),
updates HANDOFF/ACTION-ITEMS/runbook, and Phase 2 is closed for good. JC's invites start
delivering the moment Gate 4 lands.
