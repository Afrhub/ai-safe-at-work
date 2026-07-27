# HANDOFF — Attest AI / ai-safe-at-work

Updated: 26 Jul 2026 · Last commit `f061b2f` · Everything committed, pushed and live.
Read DOCTRINE.md decision log (rows 2026-07-14 → 2026-07-26) for full detail; this file is the quick resume.

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
- **Plans (bands changed 25 Jul)**: Foundation £990/yr **1-25 staff**, £1,750 **26-50**; Platform £249/mo
  1-25, £499 26-50 (billed annually £2,490/£4,990); **more than 50 = contact us** for both. Ex-VAT.
  Supersedes the 26-100 band locked 19 Jul — see DOCTRINE 2026-07-25.
- **Product videos**: platform demo (60s) + course module 1 (43s), narrated, behind the demo/course
  buttons on pricing, plus-pack and solutions. Play every time; SKIP appears once watched through.
  Source in `video-project/` (gitignored); regenerate narration with the ElevenLabs key. A "Buy now"
  overlay on the last frame points at `BUY_URL` in `assets/cinema.js` — **one line to swap for the
  GoCardless link** once that account exists.
- **Content posture (24 Jul)**: gate the doing, not the knowing. Public + indexable: homepage,
  pricing, course, plus-pack (= the Platform page), consultancy, solutions, faq, glossary,
  standards-map, module-1 (free sample), resources, templates index, about, legal. Gated pages all
  carry `noindex` so crawlers are not sent to a checkout redirect; `sitemap.xml` lists only the 21
  genuinely public URLs. `msp.html` stays noindex by choice — see `docs/parked-content.md`.
- **Paywall**: `assets/course-gate.js?v=2` (client-side; demo account excluded) gates modules 1–12,
  cert, all templates, glossary, standards-map, role tracks, sector overlays, resources.html.
  Redirect targets: course.html (modules) / checkout.html (everything else).
- **Manager portal** (`/portal/manager.html`): full in-portal compliance platform ported from the
  claude.ai artifact — 11 interactive sections (AUP publish + acks, registers, risk matrix, vendor DD,
  RACI, ToR, staff sign-off) + Manage group (team invites/credits/completion CSV). Data in Supabase
  `governance_state` (per-manager KV JSONB, RLS). Files: `portal/assets/aimp.js|aimp.css`.
  Spec: `specs/manager-dashboard.md`. Tests: `tests/manager-dashboard.{structure,crud}.mjs`
  (run: `node tests/... <url>`; needs `npm i playwright` — set up in scratchpad, not repo).
- **Nav**: Products / **Who We Help** / Plans + Sign in / Book a Demo / Become a Partner pills, on all
  77 pages. Nav is **centred** above 901px (three-column grid); it wraps to a second row below that.
  "Business Types" was renamed and repointed 26 Jul — it used to lead to a six-tick homepage section. Frameworks + Resources parked out of the nav 2026-07-21 (pages still live) —
  `docs/nav-parked-links.md` holds the markup and the open placement decision.
- **Forms**: `demo`, `foundation-order` (replaced `tier1-order`), `partner-enquiry` registered with
  Netlify. **None of them email anyone** — see BLOCKER below.
- **Who We Help** (`/who-we-help.html`, new 26 Jul): seven audience types, each as challenges-they-arrive-with
  beside what we do about it, plus a starting-point table (Foundation / Platform / Consultancy).
  Prices and the not-a-certification wording are pulled from pricing.html rather than restated.
  Regulated section links out to the three sector overlays, which were otherwise orphaned.
- **Portal additions (26 Jul)**, all in `portal/assets/aimp.js`:
  - **Dashboard → Governance Centre** (nav, heading, every guide).
  - **AI Tool Register** — a second front door beside Vendor Due Diligence, for tools with no supplier
    to send diligence to. The account-type field is the point: ChatGPT Enterprise and ChatGPT Personal
    are two rows with two different answers. **Policy Section 3 generates from it**, falling back to the
    typed list when empty.
  - **Residual risk** on the Risk Register (likelihood × impact once mitigated, same matrix, blank until
    planned, renders "Not scored" rather than assuming).
  - **Business objectives** widget at the top of the Governance Centre. Overdue computed from the target
    date, never stored.
  - **Owner fields reference staff records** (tool decision owner, use case owner, risk owner). Legacy
    typed names kept and shown "not a team member".
  - Governance Centre now flags: use case on an unregistered tool, use case on a restricted/not-approved
    tool, tool awaiting decision, tool past review, approved tool with no owner.
  - **Deliberately not built**: any "N users using unapproved AI" count. The platform cannot source it.
- **The chain is drawn** on plus-pack.html (11 steps, supplier → Governance Centre), still an `<ol>` so it
  degrades and reads in order to a screen reader. "Eleven working modules", not sections.
- **Partner commercials** (rebate tiers, wholesale per seat, margins) live only in
  `portal/reseller.html` behind the portal login. Never on a public page.

## Hard-won rules (do not relearn)
- **CSP**: production sends `script-src 'self'` — inline `onclick=`/inline `<script>` work locally but
  DIE on live. Use delegated events (`data-act` dispatcher in aimp.js; `.print-btn` delegation in
  cinema.js v13). Internal slide decks (sales/workshop/msp-client) still use inline scripts = broken live.
- **CSS/JS changes**: bump BOTH `style.css?v=` and `cinema.js?v=` site-wide (**currently v27/v23**, 84
  refs each). Portal JS is separate: `aimp.js?v=` (**currently v23**, 2 refs in `portal/*.html`).
- **Em dashes**: banned site-wide (spaced→comma, unspaced→hyphen). Swept 19 Jul.
- **AUTH_DISABLED tripwire** (`portal/assets/portal.js` = true): portal auto-signs-in demo manager.
  Before real buyers: set false, rotate/delete demo@attest-ai.com, redeploy.

## GOTCHAS (discovered the hard way)
- **Netlify publishes the WHOLE repo.** Found 26 Jul: SCOPE.md (consultancy + MSP pricing), HANDOFF.md,
  docs/ (incl. ownership-and-exit-plan), specs/, supabase/migrations/*.sql, tests/, scripts/, both
  Remotion projects incl. paid module narration MP3s, the MSP deck .pptx and a .docx of course content
  were all returning 200. Now blocked in `netlify.toml`. **`from = "/*.md"` does NOT work** — a Netlify
  splat only matches a trailing path and cannot carry an extension suffix. Use `/dir/*` or name the file.
  Anything new and internal must be added there or it ships.
- **`governance_state` is in no migration.** Every register, the policy and the acks live in a table whose
  schema and RLS exist only in the running Supabase project. Nothing in the repo reproduces it.
- **`dbGet` swallows errors into localStorage.** A permission denial is indistinguishable from an empty
  register — an RLS mistake would quietly move a customer's governance data into their own browser.
  Fix this before any feature that depends on who can read what.
- **Two parallel document systems.** The end-user portal reads `governance_docs` / writes
  `governance_acks`; the manager policy tracks its own acks inside `governance_state`. No link between
  them. Which is authoritative is undecided.
- **Scratchpad Playwright broke mid-session** (lost `playwright-core`). Tests were repointed at
  `~/projects/mlr/node_modules/playwright` via `createRequire`. Reinstall or keep borrowing.

## Open decisions / next actions (founder)

### OPEN DECISION — pricing.html is invisible to search (found 26 Jul, unanswered)
`pricing.html` contradicts itself three ways: its own `<meta robots>` says **index, follow**; it is
**listed in sitemap.xml**; and `_headers` sends **`X-Robots-Tag: noindex, nofollow`**. The header wins,
so Google is told to drop a URL the sitemap keeps submitting. The `_headers` comment explains why —
*"Pricing page is a draft today"*, written 19 May. It stopped being a draft on 21 Jul.
Three ways to resolve, none chosen:
  (a) drop `noindex, nofollow` from the `_headers` block, keep `noai, noimageai, nosnippet` — matches
      what the page and sitemap already claim, makes the rebuilt grid findable, puts prices in search;
  (b) keep it out of search but remove it from sitemap.xml and set the meta to noindex, so all three agree;
  (c) leave it — the only option where the site keeps arguing with itself.
`msp.html` carries the same header block but its meta is also noindex, so that one is consistent and
deliberate — leave it alone.

### BLOCKER — the funnel does not work. Fix before anything else.
Pricing is now published, correct and live, and it earns £0 until this is fixed.
**Nothing on the site emails anyone.** An order is a form submission sitting in the
Netlify dashboard until someone thinks to look, then a manual invoice. A buyer who
decides to pay you today cannot, and you will not know they tried.

0a. **Netlify form email notifications** (dashboard-only setting, no code):
    route **`order`**, `partner-enquiry` and `demo` to James@attest-ai.com.
    `checkout.html` posts to `order` as of 25 Jul — one form for both plans, with
    the plan carried in a hidden field, so this only needs setting once.
    `tier1-order` and `foundation-order` are orphaned earlier names; ignore them.
    Nothing on the site emails anyone until this is set.
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
    *Verified 25 Jul, the half that does not need an inbox:* Netlify accepts POSTs
    to `order`, `partner-enquiry` and `demo` (200), and rejects an unregistered
    name (404) — so form detection is live and discriminating, and submissions are
    reaching the dashboard. **The plumbing is not the blocker; only the
    notification setting is.** Test submissions were made against every form and
    should be deleted.
0f. **Delete two orphaned Netlify forms**: `tier1-order` and `foundation-order`
    still accept submissions (200) even though no page posts to them any more —
    Netlify keeps previously-detected forms registered. A cached page or an old
    link would drop an order into a form nobody watches. Remove them in the
    Netlify dashboard.

Everything below is secondary. Optimising price, copy or funnel volume ahead of this
is optimising a bucket with no bottom.

### Then
0e. **Product roadmap (founder-stated, 24 Jul).** Done: platform screens reviewed
    (all 15 render clean), modules audited for staleness, three user flows plotted
    (`docs/user-flows.md`), in-product guides live on all 11 platform screens.
    Remaining: **onboarding automation** — blocked, there is nothing to automate
    until mail and payment exist (0a/0b) — and the **support model** (AI bot first,
    then ticket), whose most common question would today be "how do I get my staff
    in?", which has no working answer while SMTP is unconfigured.
1. **RORtech call** — ask what their clients pay for their Cyber Essentials line; treat as design
   partner, not first sale; reconcile MSP 70/30 maths before honouring the founding promise.
   This is also the highest-value unknown in the revenue model: until the 70/30 reconciles,
   the partner channel (the only path past the solo delivery ceiling) is unproven.
2. **Trust fixes before conversion**: real founder bio + UK address (about.html still says
   "Founder name / Short bio goes here"), PI insurance + liability terms before first invoice.
   *(Un-gating done 24 Jul: glossary, standards map, module 1 and the resources hub are public.)*
3. **Carry the certification preface** ("A note on what we are") to course.html and the portal —
   done on index.html and pricing.html; the standing copy rule applies everywhere.
4. **"Become a Partner" nav pill + footer "Partner Programme"** are still site-wide. Pulling them
   is a commercial call, not a copy fix.
5. SMTP (AUTH-1) still unconfigured — invites/magic links rate-limited.
6. **Banked, post-validation**: £599/mo for the 26-100 Platform band after the first 5-10
   customers (~£24k/yr at 20 customers in that band, no new delivery work).

**Done 2026-07-26**: Who We Help page + nav rename (77 pages); top-bar overflow fixed (it needed 457px at
390px wide and 823px at 768px, so it never fitted — pills were crushed to discs and the theme toggle was
pushed off-screen; also `.module-grid`'s 300px floor); nav centred; AI Tool Register + residual risk +
objectives + staff-referenced owners; the chain drawn; **the whole-repo exposure closed**. Commits
`cdd00f1` → `f061b2f`.

**Done 2026-07-21**: pricing locked, published and swept site-wide (Foundation £990/£1,750,
Platform £249/£499, 100+ Contact us) — see DOCTRINE 2026-07-21 rows.

## Where things live
DOCTRINE.md (strategy + decision log) · specs/ · tests/ · docs/functional-test-coverage.md
(FT-AIMP-01/02 implemented) · .audit/council/ (untracked pricing council) · llms.txt (AI-crawler facts).
