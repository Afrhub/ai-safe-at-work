# AI Safe@Work — Portals (Reseller · Manager · End-user) — Spec

> **Created:** 2026-06-15 · drives a spec → build → review loop
> **Project:** `~/projects/ai-safe-at-work` · static front-end + Supabase backend
> **Decisions locked:** Supabase real auth (email+password+**TOTP MFA**); build all three together (shared auth/shell once, then each role view).

## Objective
One authenticated, role-gated web app with three experiences — **reseller**, **manager**, **end-user** — sharing one login/MFA flow and the existing Periwinkle/Carbon design system. The free 11-module course stays static and un-gated; these are the **paid, auth-walled surfaces**.

## Architecture (lazy + doctrine-aligned)
- **One app, three role views** — NOT three codebases. Manager view = end-user view **+ Templates + Credits**. Role gates what's visible.
- **Static HTML + `@supabase/supabase-js` from CDN.** No React/Vue/build step (keeps doctrine: static, deploy-anywhere). Pages under `/portal/`.
- **Supabase** = auth (email+password, TOTP MFA enforced for all roles), Postgres (credits, deal-reg, seats), Row-Level Security per role. Confirm/create project in build phase via the connected Supabase MCP.
- Shared `portal/assets/portal.css` (extends the site tokens) + `portal/assets/portal.js` (supabase client, session guard, role routing).
- Hosting: same Netlify site, `/portal/*`. Add `X-Robots-Tag: noindex` (paid surface, per anti-scraping doctrine).

## Roles & access
| Role | Sees |
|---|---|
| **end_user** | Dashboard → the 11 modules + own progress + own certificate |
| **manager** | Everything end_user sees **+ Templates** (7 audit-ready docs) **+ Credits** (balance, assign seats to end-users) |
| **reseller** | Deal Registration · Marketing Material · Pitch Deck — premium "big clickable boxes" UX |

## Data model (minimal — Supabase Postgres)
- `profiles` — `id` (FK auth.users), `email`, `full_name`, `role` (`end_user`|`manager`|`reseller`), `manager_id` (nullable), `reseller_id` (nullable), `credits_balance` int default 0 (managers only).
- `seats` — `id`, `manager_id`, `end_user_id`, `created_at`. (One credit assigned = one seat row; balance decrements.)
- `module_progress` — `id`, `user_id`, `module` int, `status` (`done`), `score` int, `updated_at`.
- `deal_registrations` — `id`, `reseller_id`, `customer_name`, `customer_contact`, `est_value`, `stage` (`registered`|`qualified`|`won`|`lost`), `notes`, `created_at`.
- **RLS:** users read/write only their own rows; managers read their seated end-users' progress; resellers read only their own deals. Service role for admin grants.
- **Credits:** assigning a seat decrements `credits_balance` (DB function, atomic; reject if balance 0). Granting credits to a manager = admin/service action (no online purchase — billing out of scope).

## Auth flow (all roles)
1. Email + password sign-in (`signInWithPassword`).
2. **TOTP MFA** required: enrol on first login (`auth.mfa.enroll` → QR), challenge+verify each session. No portal content renders until AAL2.
3. Session guard on every `/portal/*` page → redirect to `/portal/login.html` if no AAL2 session.
4. Role read from `profiles.role` → route to the correct dashboard; hide/deny other roles' pages (client gate + RLS server gate).

## Reseller portal (the showpiece — award-winning, UX-priority)
- **Big clickable boxes** home: three large cards → Deal Registration · Marketing Material · Pitch Deck. Hover/press feedback, crop-mark dossier styling, generous spacing.
- **Deal Registration:** a clean form (customer, contact, est. value, notes) + a table of the reseller's deals with stage chips; edit stage. First-registered-deal rule noted (doctrine § Sales partners).
- **Marketing Material:** downloadable assets (logos, one-pagers) — Supabase Storage bucket or static files in `/portal/assets/marketing/`.
- **Pitch Deck:** embed/link the existing deck (`.audit/sales-deck.html` → move to `/portal/assets/`).
- Premium feel: the highest-polish surface; clarity and ease over density.

## Manager portal
- End-user dashboard **plus**:
- **Templates:** the 7 audit-ready templates (AUP, DPIA, FRIA, vendor questionnaire, training register, incident form, ATRS) as downloads/links.
- **Credits:** show `credits_balance`; "Assign seat" → pick/enter an end-user email → creates seat, decrements balance, sends Supabase invite; list assigned seats + their progress.

## End-user portal
- Dashboard: the 11 modules with personal progress, resume link, and certificate when earned. Login + password + MFA.

## Design
- Periwinkle/Carbon, Atkinson, dossier language (REF chips, crop-mark cards, §-watermarks). Light/dark parity. Reseller gets the most premium treatment.

## Explicitly out of scope (v1)
- Online payment/billing (credits granted by admin, not bought in-portal — purchasing is a prohibited action anyway).
- SSO/SAML, custom email infra beyond Supabase, multi-language, native apps, analytics/tracking.
- Re-gating the free core course (stays public/static).

## Definition of Done
- [ ] `/portal/login.html`: email+password sign-in; TOTP MFA enrol + challenge; no content before AAL2.
- [ ] Supabase project live with `profiles`, `seats`, `module_progress`, `deal_registrations` + RLS; verified a user can't read another's rows.
- [ ] Role routing: each test user (reseller/manager/end_user) lands on the right dashboard and is denied the others (client + RLS).
- [ ] End-user: sees 11 modules + own progress.
- [ ] Manager: sees modules + Templates downloads + Credits balance; "Assign seat" decrements balance and creates a seat (rejects at 0).
- [ ] Reseller: big-clickable-box home; can register a deal and see it listed with a stage chip; marketing + pitch deck reachable.
- [ ] All `/portal/*` `noindex`; verified in `_headers`.
- [ ] Renders clean in light + dark, desktop + mobile.
- [ ] Deployed; smoke-tested live with one user per role.

## Build loop order
1. Shared shell: Supabase project + schema + RLS, `portal.css`/`portal.js`, `login.html` with MFA, session guard, role router. **Review.**
2. End-user dashboard. **Review.**
3. Manager (templates + credits + assign-seat). **Review.**
4. Reseller (deal-reg + assets + deck, premium polish). **Review.**
Each step: build → `/code-review` (or review skill) → fix → next.

## Notes for the builder
- Secrets: Supabase `anon` key is public (safe in client, RLS protects data). Never expose the service-role key client-side.
- Keep `supabase-js` from the CDN (`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`) — no bundler.
- MFA: Supabase TOTP is GA in supabase-js v2 `auth.mfa.*`. Enforce AAL2 in the session guard.
- Don't touch the static course/marketing pages except to add a "Portal login" link.
