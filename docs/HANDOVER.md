# Handover — AI Safe@Work / Attest AI

*Session handover for picking up work in a new conversation. Updated 2026-06-26.*
*No secrets in this file. The repo is **public** — keep it that way.*

## 1. Project snapshot
- **What it is:** AI Governance, Risk & Compliance training + platform for SMB staff. Free 12-module course (stays free — the wedge) + paid governance/consultancy tiers + MSP channel. Static HTML site + Supabase-backed portals.
- **Tech:** Plain **HTML/CSS/vanilla JS** (no framework, no build) + **PostgreSQL/PL-pgSQL** (Supabase). **Atkinson Hyperlegible** font (deliberate accessibility choice). Remotion (TS/React) drives module videos in a separate sub-project.
- **Repo:** `~/projects/ai-safe-at-work` → `github.com/Afrhub/ai-safe-at-work` (**PUBLIC**).
- **Deploy:** `git push` **auto-deploys to Netlify** in seconds. (Older notes saying "API-only deploy" are obsolete — git push = deploy.)

## 2. Infrastructure & access
| Thing | Value / state |
|---|---|
| Supabase project | `hanjrsslhnuauaysbhun` ("aisafework-portals"), **Pro**, AWS **eu-west-2 London** |
| Live URL | `aisafework.netlify.app` (Netlify, auto-deploy from git) |
| **Canonical domain** | **`attest-ai.com`** — chosen, **NOT yet registered** (purchase in progress at Cloudflare; a financial action only the owner can complete) |
| GitHub auth | Works on this machine (OAuth token in macOS keychain, user `Afrhub`) |
| Local-only secret | `ELEVENLABS_API_KEY` in `video-m2/.env` (gitignored, never committed) |

## 3. What was done in the last session
- **Logo:** periwinkle "safe-vault AI" mark `assets/logo.png`, later enlarged (now `height:6em`), then recoloured orange in the rebrand.
- **Information architecture rebuild** (spec→build→review; spec at `specs/site-ia.md`): standardised nav, named/anchored sections per page, **three-tier positioning** (Train / Plus Pack / Consultancy), trimmed Course (Templates → Plus Pack; Sector/Role tracks → Resources as marketing), new `phase-2.html`, portals re-scoped to **MVP placeholders**.
- **New hero:** "AI Governance, Risk & Compliance Training for Modern Businesses" + Request-a-Demo / Become-a-Partner CTAs.
- **Domain rename:** `aisafeatwork.org` → `attest-ai.com` across the whole repo (incl. contact emails).
- **Security (applied LIVE to Supabase):** full OWASP Top-10 review and remediation via **migrations `0004`/`0005`/`0006`** — fixed Critical (profile role self-escalation), High (seat-insert bypass / arbitrary `assign_seat`), Medium (XSS escaping, server-graded completion via `quiz_keys`/`record_quiz_result`, append-only `audit_log`). Portal CSP hardened (no `unsafe-inline`, scripts externalised), `supabase-js` pinned to `2.108.2`. Secret scans clean (only the public publishable key ships). **Leaked-password protection + min-length 10 enabled and functionally verified live.** Full write-up: `.audit/security/owasp-security-review-2026-06-23.md` (**gitignored — private**).
- **Branded PDFs:** `docs/architecture-security-onepager.pdf` (2-page, incl. system diagram). `docs/subscription-model.pdf` exists **uncommitted/local** (draft pricing). `docs/ownership-and-exit-plan.md` = no-lock-in / DR runbook. Offline code zip at `~/attest-ai-backups/`.
- **Subscription model defined** (Train / Govern / Managed + MSP wholesale + rebate) — indicative figures live in the local `subscription-model.pdf`; not yet codified in `SCOPE.md`.
- **Skills:** installed the `taste-skill` pack into `~/.claude/skills/`; renamed 9 colliding skills to `taste-*`.
- **3 demo landing pages** (uncommitted, `noindex` reference): `attest-landing.html` (taste-soft), `attest-landing-gpt.html` (gpt-taste), `attest-landing-palo.html` (Palo Alto enterprise).
- **Whole-site rebrand (live):** periwinkle → **Palo Alto orange `#fa582d`** across all pages; kept **Atkinson font + dark theme**; regenerated orange logo; functional green/red/blue colours untouched. Committed + pushed.

## 4. Open items / next steps (priority order)
1. **Register `attest-ai.com`** (owner's payment). Cloudflare country field = *select from dropdown, don't type*; or use Porkbun/Namecheap. Then: add domain in Netlify → DNS records → set Supabase Auth Site URL + redirect allowlist → Cloudflare Email Routing for `@attest-ai.com`.
2. **Enable 2FA** on GitHub, Cloudflare, Supabase, Netlify.
3. **Finish the rebrand:** regenerate `og-card.png` in orange; update `DOCTRINE.md §5` (still says "Periwinkle Blueprint" — now stale); optionally flip `v2/` (on amber `#e8a726`) to orange.
4. **SEO fixes** (audit complete): add `<link rel="canonical">` to ~33 pages; trim ~20 over-long meta descriptions + ~12 titles; un-noindex `glossary`/`resources`; add FAQPage schema. **Note: sitemap + `og:url` currently point at the not-yet-live `attest-ai.com`.**
5. **Pre-launch security/scale:** add CAPTCHA (Turnstile/hCaptcha) + **custom SMTP** (the real 50k onboarding bottleneck). Both documented in `docs/production.md`.
6. Decide whether to **codify the subscription model into `SCOPE.md`**, and what to do with the **3 demo landings** (promote one as the marketing front, or discard).

## 5. Critical gotchas
- **Repo is PUBLIC** — never commit secrets, the OWASP report, or draft pricing. Intentionally kept out of git: `.audit/security/owasp-*.md`, `docs/subscription-model.pdf`, the 3 `attest-landing*.html` demos.
- **`git push` = live deploy.** Be deliberate.
- **The doctrine was overridden** (periwinkle → orange). `DOCTRINE.md` is out of sync with the live site — treat the live site as source of truth until the doctrine is updated.
- **Free 12 core modules stay free** (doctrine red line). The subscription monetises the operational/evidence/advisory layer, never the lessons.
- **Atkinson Hyperlegible is deliberate** (low-vision accessibility) — do not swap it for decorative fonts.
- Migrations `0004`–`0006` are **already applied to the live DB** — don't re-run. The migration files double as the portable schema backup (DB is near-empty: 0 real users).
- This machine: no Homebrew, no `pg_dump`/`supabase` CLI, no `gh`. Node is a user-local tarball. Use the Supabase MCP for DB ops.
