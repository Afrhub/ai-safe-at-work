# HANDOFF — Attest AI / ai-safe-at-work

Updated: 19 Jul 2026 · Last commit `c62ef1b` · Everything committed and live.
Read DOCTRINE.md decision log (rows 2026-07-14 → 2026-07-19) for full detail; this file is the quick resume.

## What this is
Attest AI (aisafework.netlify.app, canonical attest-ai.com when DNS pointed): static site + Supabase
(`hanjrsslhnuauaysbhun`) selling AI governance to UK/EU SMEs and MSPs.
**git push = deploy** (Netlify site `89ac5015-5b19-4568-b337-d3fe38e9e805`). Pre-push hook validates
JSON/JSON-LD and blocks secrets + forbidden files (`docs/subscription-model.pdf` stays untracked).

## Current state (all live)
- **Tiers**: T1 = AI Safe@Work training + full Plus Pack, **£1,000 one-off** (checkout.html = Netlify
  order form `tier1-order`, invoiced manually — no card processing by design). T2 = Attest AI Platform,
  subscription, **price not published**. T3 = consultancy.
- **Paywall**: `assets/course-gate.js?v=2` (client-side; demo account excluded) gates modules 1–12,
  cert, all templates, glossary, standards-map, role tracks, sector overlays, resources.html.
  Redirect targets: course.html (modules) / checkout.html (everything else).
- **Manager portal** (`/portal/manager.html`): full in-portal compliance platform ported from the
  claude.ai artifact — 11 interactive sections (AUP publish + acks, registers, risk matrix, vendor DD,
  RACI, ToR, staff sign-off) + Manage group (team invites/credits/completion CSV). Data in Supabase
  `governance_state` (per-manager KV JSONB, RLS). Files: `portal/assets/aimp.js|aimp.css`.
  Spec: `specs/manager-dashboard.md`. Tests: `tests/manager-dashboard.{structure,crud}.mjs`
  (run: `node tests/... <url>`; needs `npm i playwright` — set up in scratchpad, not repo).
- **Nav**: CyberSmart-aligned (Products/Frameworks/Business Types/Resources/Plans + Sign in /
  Book a Demo / Become a Partner pills) on all ~72 pages.
- **Forms**: `demo`, `tier1-order`, `partner-enquiry` all registered with Netlify.

## Hard-won rules (do not relearn)
- **CSP**: production sends `script-src 'self'` — inline `onclick=`/inline `<script>` work locally but
  DIE on live. Use delegated events (`data-act` dispatcher in aimp.js; `.print-btn` delegation in
  cinema.js v13). Internal slide decks (sales/workshop/msp-client) still use inline scripts = broken live.
- **CSS/JS changes**: bump BOTH `style.css?v=` and `cinema.js?v=` site-wide (currently v21/v13).
- **Em dashes**: banned site-wide (spaced→comma, unspaced→hyphen). Swept 19 Jul.
- **AUTH_DISABLED tripwire** (`portal/assets/portal.js` = true): portal auto-signs-in demo manager.
  Before real buyers: set false, rotate/delete demo@attest-ai.com, redeploy.

## Open decisions / next actions (founder)
1. **Tier 2 price is unset** — council verdict (19 Jul, `.audit/council/council-report-2026-07-19.html`,
   deliberately untracked): Platform £249/mo ≤25 staff / £499/mo ≤100 billed annually; restructure the
   £1,000 one-off into £990/yr Foundation (training + starter templates only — the full-Plus-Pack-forever
   bundle cannibalises the subscription); market as "under £9/user/month".
2. **RORtech call** — ask what their clients pay for their Cyber Essentials line; treat as design
   partner, not first sale; reconcile MSP 70/30 maths before honouring the founding promise.
3. **Trust fixes before conversion**: real founder bio + UK address (about.html still says
   "Founder name / Short bio goes here"), un-gate glossary + standards map + one sample module,
   PI insurance + liability terms before first invoice.
4. **Netlify email notifications** (dashboard-only setting): route `partner-enquiry` to
   James@attest-ai.com (+ `tier1-order`, `demo` — currently nothing emails anyone).
5. SMTP (AUTH-1) still unconfigured — invites/magic links rate-limited.

## Where things live
DOCTRINE.md (strategy + decision log) · specs/ · tests/ · docs/functional-test-coverage.md
(FT-AIMP-01/02 implemented) · .audit/council/ (untracked pricing council) · llms.txt (AI-crawler facts).
