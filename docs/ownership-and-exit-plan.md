# Ownership, Backups & Exit Plan

*How to prove you own every part of this solution, keep your own copies, and move
the whole thing to another provider with no lock-in. Doubles as a DR runbook and
a partner/procurement "no lock-in" artifact. Contains no secrets.*

## 1. What you own — inventory

| Asset | Provider | You control | Portable to |
|---|---|---|---|
| **Code** | GitHub (`github.com/Afrhub/ai-safe-at-work`) + local clone | Full source. Plain static HTML + CSS + JS, **no build step**. | Any web server / static host |
| **Database schema** | Your repo (`supabase/migrations/0001–0006`) | Every table, RLS policy, function, trigger — version-controlled. | Any PostgreSQL |
| **Database data** | Supabase project (your org, AWS London, Pro) | Your data; fully exportable via `pg_dump`. | Any PostgreSQL |
| **Auth / identity** | Supabase GoTrue (in the same project) | Users, MFA factors. | Self-hosted Supabase, or re-platform (effort — see §4) |
| **Domain & DNS** | Cloudflare Registrar (your account) | Registrant + full DNS. | Transferable to any registrar after 60 days |
| **TLS / SSL** | Auto-issued (Let's Encrypt) by the host, for your domain | Implicit — you own the domain, so any host issues a cert. | Re-issued automatically on any host |
| **Hosting** | Netlify (your account) — `git push` deploys | The deploy; nothing custom. | Cloudflare Pages / Vercel / S3+CloudFront / any static host |
| **Email** | Cloudflare Email Routing (to set up) for `@attest-ai.com` | Forwarding rules. | Any email provider via MX records |

**Nothing here is locked to a vendor.** The only "managed" services (Supabase,
Netlify) sit under **your own accounts** and are both fully exportable.

## 2. Keep your own copies (do this periodically)

**Code — offline archive** (independent of GitHub):
```bash
cd ~/projects/ai-safe-at-work
git archive --format=zip -o ~/attest-ai-backups/attest-ai-code-$(date +%F).zip HEAD
```
Store the zip somewhere you control (external drive / cloud). GitHub + your local
clone are already two copies; this is the third.

**Database — full export** (`pg_dump`). Get the connection string from the Supabase
dashboard → **Project Settings → Database → Connection string (URI)** (it includes
the password). Then:
```bash
# install the Postgres client first if needed (macOS): brew install libpq
# OR run via the Supabase CLI with npx (no global install):  npx supabase db dump --db-url "<URI>" -f attest-ai-db-$(date +%F).sql

pg_dump "postgresql://postgres:[PASSWORD]@db.hanjrsslhnuauaysbhun.supabase.co:5432/postgres" \
  --no-owner --no-privileges -n public -Fc \
  -f ~/attest-ai-backups/attest-ai-db-$(date +%F).dump
```
- `-n public` = your application tables (the `auth` schema is Supabase-managed).
- Restore anywhere with `pg_restore -d "<target-db-url>" attest-ai-db-*.dump`.
- **Note:** the database is currently near-empty (no real users yet), so right now
  the schema in `supabase/migrations/` *is* your current copy. Start weekly dumps
  once real users sign up.
- Supabase also keeps **daily backups + Point-in-Time Recovery** (Pro) — those are
  the provider's; the `pg_dump` is the copy *you* hold.

**Automating it:** a weekly local `cron`/`launchd` job running the two commands
above, or a GitHub Action (store the DB URI as an encrypted Actions secret, never
in the repo). Either is fine.

## 3. Move to another host (frontend) — ~30 min, zero data risk
The site is static, so "migrating hosting" is just re-uploading files:
1. New host (Cloudflare Pages / Vercel / S3+CloudFront): point it at the same
   GitHub repo (or upload the zip).
2. Port `_headers` + `netlify.toml` redirects to the new host's equivalent
   (Cloudflare Pages also reads `_headers`/`_redirects`).
3. Repoint DNS (Cloudflare) at the new host. SSL re-issues automatically.

## 4. Move the data layer off Supabase — the one real-effort piece
- **Data:** `pg_dump` → `pg_restore` into any PostgreSQL (AWS RDS, Azure, self-host,
  or self-hosted Supabase). Update `portal/config.js` (URL) and the portal CSP
  `connect-src` to the new host.
- **Auth is the catch:** Supabase GoTrue (email+password + MFA) is the one component
  that doesn't `pg_dump` cleanly to a different stack. Options: self-host Supabase
  (keeps everything identical), or re-implement auth on the new platform (Cognito,
  Entra, etc.) — weeks of work, only justified if a contract forces it. See
  `docs/production.md` §10. Until then there's no reason to leave.

## 5. Custody checklist (protect what you own)
- [ ] **2FA on every account**: GitHub, Cloudflare, Supabase, Netlify.
- [ ] **Cloudflare**: registrant email valid + auto-renew ON (domain loss is almost
      always a lapsed renewal or lost account, not a vendor grab).
- [ ] **Secrets stay out of the repo**: Supabase **service-role key** lives only in
      the Supabase dashboard; the frontend ships only the **publishable** key (public
      by design). `ELEVENLABS_API_KEY` lives only in local `video-m2/.env` (gitignored).
- [ ] **Backups off-machine**: store the code zip + DB dump on a second location.
- [ ] Keep this file's account list current as providers change.
