# HANDOFF — Attest AI / ai-safe-at-work

Updated: 19 Jul 2026 · Last commit `c62ef1b` · Everything committed and live.
Read DOCTRINE.md decision log (rows 2026-07-14 → 2026-07-19) for full detail; this file is the quick resume.

## What this is
Attest AI (aisafework.netlify.app, canonical attest-ai.com when DNS pointed): static site + Supabase
(`hanjrsslhnuauaysbhun`) selling AI governance to UK/EU SMEs and MSPs.
**git push = deploy** (Netlify site `89ac5015-5b19-4568-b337-d3fe38e9e805`). Pre-push hook validates
JSON/JSON-LD and blocks secrets + forbidden files (`docs/subscription-model.pdf` stays untracked).

## Current state (all live)
- **Plans** (published 2026-07-21; tier numbers retired site-wide): **Foundation** £990/yr up to 25
  staff, £1,750 up to 100 (training + starter templates). **Attest AI Platform** £249/mo up to 25,
  £499 up to 100, billed annually £2,490/£4,990 (includes the training). Over 100 staff = Contact us
  for both. **Consultancy** quoted per engagement. All ex-VAT; band price held 12 months.
  checkout.html = Netlify order form `foundation-order` with a required headcount band selector,
  invoiced manually — no card processing (deliberate seam, see BLOCKER below).
  Grid + rationale: DOCTRINE 2026-07-19 / 2026-07-21 rows.
- **Certification copy rule**: "audit-ready" may only mean *records organised the way an auditor asks
  for them*, never "you will pass". Attest AI never presents as a certification/accreditation body.
  The "A note on what we are" preface is on index.html and pricing.html; course + portal still to do.
- **Paywall**: `assets/course-gate.js?v=2` (client-side; demo account excluded) gates modules 1–12,
  cert, all templates, glossary, standards-map, role tracks, sector overlays, resources.html.
  Redirect targets: course.html (modules) / checkout.html (everything else).
- **Manager portal** (`/portal/manager.html`): full in-portal compliance platform ported from the
  claude.ai artifact — 11 interactive sections (AUP publish + acks, registers, risk matrix, vendor DD,
  RACI, ToR, staff sign-off) + Manage group (team invites/credits/completion CSV). Data in Supabase
  `governance_state` (per-manager KV JSONB, RLS). Files: `portal/assets/aimp.js|aimp.css`.
  Spec: `specs/manager-dashboard.md`. Tests: `tests/manager-dashboard.{structure,crud}.mjs`
  (run: `node tests/... <url>`; needs `npm i playwright` — set up in scratchpad, not repo).
- **Nav**: Products / Business Types / Plans + Sign in / Book a Demo / Become a Partner pills, on all
  76 pages. Frameworks + Resources parked out of the nav 2026-07-21 (pages still live) —
  `docs/nav-parked-links.md` holds the markup and the open placement decision.
- **Forms**: `demo`, `foundation-order` (replaced `tier1-order`), `partner-enquiry` registered with
  Netlify. **None of them email anyone** — see BLOCKER below.
- **Partner commercials** (rebate tiers, wholesale per seat, margins) live only in
  `portal/reseller.html` behind the portal login. Never on a public page.

## Hard-won rules (do not relearn)
- **CSP**: production sends `script-src 'self'` — inline `onclick=`/inline `<script>` work locally but
  DIE on live. Use delegated events (`data-act` dispatcher in aimp.js; `.print-btn` delegation in
  cinema.js v13). Internal slide decks (sales/workshop/msp-client) still use inline scripts = broken live.
- **CSS/JS changes**: bump BOTH `style.css?v=` and `cinema.js?v=` site-wide (currently v21/v13).
- **Em dashes**: banned site-wide (spaced→comma, unspaced→hyphen). Swept 19 Jul.
- **AUTH_DISABLED tripwire** (`portal/assets/portal.js` = true): portal auto-signs-in demo manager.
  Before real buyers: set false, rotate/delete demo@attest-ai.com, redeploy.

## Open decisions / next actions (founder)

### BLOCKER — the funnel does not work. Fix before anything else.
Pricing is now published, correct and live, and it earns £0 until this is fixed.
**Nothing on the site emails anyone.** An order is a form submission sitting in the
Netlify dashboard until someone thinks to look, then a manual invoice. A buyer who
decides to pay you today cannot, and you will not know they tried.

0a. **Netlify form email notifications** (dashboard-only setting, no code):
    route `foundation-order`, `partner-enquiry` and `demo` to James@attest-ai.com.
    Note `tier1-order` is now orphaned — `checkout.html` posts to `foundation-order`
    as of 2026-07-21. Nothing on the site emails anyone until this is set.
0b. **Payment path.** Manual invoicing was a deliberate seam, not an accident, but it
    caps conversion at whatever a stranger will do on trust: fill in a form, wait for
    an invoice, pay by transfer. At £990-£4,990 that is survivable for a while; it is
    not survivable as the only option. Decide: keep manual for the first 5-10
    customers (defensible, gives price-discovery conversations), or wire a processor.
0d. **Weekly digest is built but cannot send.** The dashboard composes the
    digest and offers Copy / Email (opens the mail client). Automatic weekly
    send needs a provider, `MAIL_API_KEY`, `DIGEST_TO` and a Supabase
    SERVICE key in Netlify env, then a scheduled function. Steps and the
    do-not-reimplement-the-rules warning: `docs/weekly-digest.md`.
0c. **Confirm the loop end-to-end** before promoting anything: submit the live form,
    confirm the email arrives, confirm an invoice can be raised and portal access
    granted. Never assume the form works because the page renders.

Everything below is secondary. Optimising price, copy or funnel volume ahead of this
is optimising a bucket with no bottom.

### Then
1. **RORtech call** — ask what their clients pay for their Cyber Essentials line; treat as design
   partner, not first sale; reconcile MSP 70/30 maths before honouring the founding promise.
   This is also the highest-value unknown in the revenue model: until the 70/30 reconciles,
   the partner channel (the only path past the solo delivery ceiling) is unproven.
2. **Trust fixes before conversion**: real founder bio + UK address (about.html still says
   "Founder name / Short bio goes here"), un-gate glossary + standards map + one sample module,
   PI insurance + liability terms before first invoice.
3. **Carry the certification preface** ("A note on what we are") to course.html and the portal —
   done on index.html and pricing.html; the standing copy rule applies everywhere.
4. **"Become a Partner" nav pill + footer "Partner Programme"** are still site-wide. Pulling them
   is a commercial call, not a copy fix.
5. SMTP (AUTH-1) still unconfigured — invites/magic links rate-limited.
6. **Banked, post-validation**: £599/mo for the 26-100 Platform band after the first 5-10
   customers (~£24k/yr at 20 customers in that band, no new delivery work).

**Done 2026-07-21**: pricing locked, published and swept site-wide (Foundation £990/£1,750,
Platform £249/£499, 100+ Contact us) — see DOCTRINE 2026-07-21 rows.

## Where things live
DOCTRINE.md (strategy + decision log) · specs/ · tests/ · docs/functional-test-coverage.md
(FT-AIMP-01/02 implemented) · .audit/council/ (untracked pricing council) · llms.txt (AI-crawler facts).
