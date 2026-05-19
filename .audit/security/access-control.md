# Access control register

> **Owner:** Founder · **Effective:** 2026-05-19 · **Review:** quarterly + on any role change

## Current state — solo

All accounts currently controlled by the founder. MFA on every account. Password manager holding all credentials.

## Principles

1. **Least access** — each future role gets only the access required to perform it.
2. **MFA mandatory** — no exception. SMS not acceptable as primary; TOTP or hardware key only.
3. **Per-person accounts** — no shared logins, ever. When a second person joins, this becomes critical.
4. **Quarterly review** — every active account reviewed; unused accounts removed.
5. **Off-boarding triggers** — when someone leaves, all access revoked same business day.

## Account inventory

| Account | Tier / role | MFA | Last reviewed | Notes |
|---|---|---|---|---|
| Anthropic — Founder | Paid | TOTP | 2026-05-19 | Workspace owner |
| OpenAI — Founder | Paid | TOTP | 2026-05-19 | Workspace owner |
| Cursor — Founder | Paid | OAuth + MFA | 2026-05-19 | Tied to GitHub |
| GitHub — Founder | Free | passkey + TOTP | 2026-05-19 | Repo + actions |
| Cloudflare / Netlify — Founder | Free → paid TBD | TOTP | 2026-05-19 | Hosting (provider TBD) |
| Domain registrar — Founder | n/a | TBD | TBD | aisafeatwork.org pending registration |
| Email provider — Founder | TBD | TBD | TBD | Pre-launch decision |
| Stripe — Founder | n/a | TBD | n/a | Pre-commercial |
| Bookkeeping — Founder | n/a | TBD | n/a | Pre-commercial |
| Password manager — Founder | Paid | hardware key + master password | 2026-05-19 | All other credentials live here |
| Bank — business | n/a | TBD | n/a | Pre-incorporation |

## Joiner / mover / leaver

### Joiner

1. New account created with minimum-required scope.
2. MFA enabled within 24 hours.
3. Credentials shared via password-manager invite only — never email / chat.
4. Onboarding completed for the role's tier of AI Safe@Work modules.
5. Listed in this register before access is operationally used.

### Mover

1. Old access reduced or revoked within 5 business days.
2. New access provisioned at minimum scope.
3. Update this register.

### Leaver

1. All access revoked same business day as departure.
2. Devices recovered.
3. Final review of credentials and any shared resources.
4. Listed `revoked YYYY-MM-DD` in this register.

## Privileged access

Currently 100% privileged (solo). When second person joins, defines who has admin on each system.
