# AI Safe@Work — Site Information Architecture & Navigation

> **Created:** 2026-06-23 · drives a spec → build → review loop
> **Project:** `~/projects/ai-safe-at-work` · static HTML + Supabase portals
> **Source:** founder-supplied content layout map (2026-06-23).

## Objective

Restructure the public site and the three portals to a single, explicit
information architecture: a fixed top navigation, a defined set of **named,
anchored sections** on every primary page, three role-portal layouts, and a
**Phase 2 (Coming Soon)** surface for the advisory services. This is a
layout/navigation reorganisation — **reuse existing copy**, do not rewrite the
course or invent new marketing claims. Honour DOCTRINE: static HTML only, no
build step, Periwinkle/Carbon design system, no emoji, plain English, primary
sources for any standards cite. Free-core stays free and un-gated.

## Global navigation (every top-level marketing page)

Canonical primary nav, identical markup on `index, course, plus-pack, msp,
about, consultancy, pricing, resources` and any other top-level marketing page:

| Label | href |
|---|---|
| (brand logo → Home) | `index.html` |
| Course | `course.html` |
| Plus Pack | `plus-pack.html` |
| MSP Partners | `msp.html` |
| About Us | `about.html` |
| Sign in | `portal/login.html` |

- Rename the existing `About` nav item to **About Us**.
- The current-page link keeps `is-current`.
- Secondary pages (standards-map, resources, security, etc.) stay reachable
  from the footer, not the primary nav. Do not expand the primary nav beyond
  the six items above.

## Page section maps (named `<section>` with `id`, in this order)

Each primary page gets an in-page **section sub-nav** (anchor links to the
section ids below) directly under the hero, so the layout map is navigable.
Reuse existing content blocks; only add a section where one is missing.

### Home — `index.html`
1. `#hero` — Hero (existing gate hero + audience cards + primary CTA)
2. `#why` — Why AI Safe@Work? (the wedge / problem framing)
3. `#course` — The Course (summary card → `course.html`)
4. `#plus-pack` — Plus Pack (summary card → `plus-pack.html`)
5. `#who-we-help` — Who We Help (SMB staff, managers, MSPs, sectors)
6. `#msp` — MSP Partner Programme (summary → `msp.html`)
7. `#about` — About Us (one-paragraph + link → `about.html`)
8. `#cta` — Call to Action (start the course / book a demo)

### Course — `course.html`
1. `#overview` — Course Overview (reuse hero/"the whole" lede)
2. `#outcomes` — Learning Outcomes (what a learner can do after; bullet list)
3. `#modules` — Module Breakdown (reuse existing module list + roles + sectors)
4. `#certification` — Certification (cert + knowledge checks; link `cert.html`)

### Plus Pack — `plus-pack.html`
1. `#overview` — Overview
2. `#whats-included` — What's Included (reuse existing)
3. `#templates` — Governance Templates (reuse the templates grid)
4. `#benefits` — Benefits to Businesses (reuse "benefits to your business")
5. `#coming-soon` — Coming Soon Features (reuse "coming soon")

### MSP Partners — `msp.html`
1. `#overview` — Partner Programme Overview
2. `#benefits` — Partner Benefits
3. `#rebate` — Rebate Structure (reuse rebate tiers / curve)
4. `#marketing` — Marketing Resources (co-brandable deck, one-pagers; link portal)
5. `#become-a-partner` — Become a Partner (enquiry CTA, first-registered-deal note)

### About Us — `about.html`
1. `#mission` — Our Mission (reuse)
2. `#experience` — Our Experience (reuse)
3. `#founders` — Meet the Founders (reuse)
4. `#contact` — Contact, with three labelled routes:
   - Request a Demo
   - Partner Enquiries
   - General Contact

## Portals (authenticated `/portal/*` — paid surface, `noindex`)

Each portal keeps its existing auth/role guard and Supabase wiring. Add a
**portal sub-nav** in `.portal-top` listing the role's areas (anchor links to
sections already on the page, or clearly-marked "Coming soon" stubs where the
data layer does not exist yet). Do not add new backend/DB behaviour.

### User Portal — `portal/end-user.html`
Dashboard · My Courses · Certificates · Progress Tracking
(Map to existing learning grid + progress; add Certificates section linking
`cert.html`.)

### Customer Admin Portal — `portal/manager.html`
Dashboard · User Management · Training Reports · Certificates & Compliance
(Map to existing credits/seats/templates; "Training Reports" and "Certificates
& Compliance" may be read-only summaries of existing `module_progress`, or
"Coming soon" stubs if no query exists.)

### MSP Partner Portal — `portal/reseller.html`
Dashboard · Customer Management · Licence Management · Rebate Tracking ·
Marketing Resources
(Map to existing deal stats/registration + marketing/pitch deck. "Licence
Management" and "Rebate Tracking" are "Coming soon" stubs unless a query
already exists.)

## Phase 2 (Coming Soon) — new page `phase-2.html`

A single public page listing the Phase-2 advisory services as "Coming soon"
cards (no pricing, no purchase). Linked from the footer (and from `msp.html`
#marketing / `index.html` where relevant), **not** the primary nav.

Cards: AI Governance Health Check · Governance Consultancy · AI Governance
Readiness · ISO 42001 Readiness · Fractional AI Governance Advisor ·
Resource Centre / Blog.

Guardrail: ISO 42001 is **Readiness**, never "Certification" (DOCTRINE).
`consultancy.html` may be linked from the Governance Consultancy card.

## Edge cases / constraints

- **Idempotent nav edit:** rename must not double-apply if re-run.
- **Anchor links must resolve** — every sub-nav target id exists on the page.
- **No emoji, no new dependencies, no JS framework.** Plain HTML + existing CSS.
- **Design system:** new sections use existing classes/tokens (periwinkle
  accent, carbon bg, Atkinson type). Match sibling markup.
- **Don't paywall free core**; portals stay behind auth, marketing stays open.
- **Coming-soon stubs** must read as intentional (labelled "Coming soon"), not
  broken/empty.
- Existing SEO/JSON-LD, skip-link, footer, and logo must survive edits.

## Definition of done (testable)

1. All six primary nav items present, identical, in order on every top-level
   marketing page; `About` reads **About Us**; current page marked.
2. `index, course, plus-pack, msp, about` each contain **every** section id in
   their map above, in order, with a working in-page sub-nav whose every link
   resolves to an on-page id.
3. The three portal pages each show a sub-nav listing their role's areas; every
   area is either a real on-page section or a labelled "Coming soon" stub.
4. `phase-2.html` exists, lists all six Phase-2 services as coming-soon cards,
   is linked from the footer, and is **not** in the primary nav. ISO 42001 card
   says "Readiness".
5. No emoji; no new JS/deps; pages still validate as before; logo + skip-link +
   footer intact on every edited page.
6. Grep check: `grep -L 'About Us' index.html course.html plus-pack.html msp.html about.html` returns nothing; each page map's ids all present.

---

# MVP refinement — round 2 (2026-06-23)

Simplifies the above toward a shippable MVP. Where this conflicts with round 1,
**round 2 wins**.

## Hero (`index.html`) — replace headline + CTAs
- Brand line: **AI Safe@Work**
- Headline: **AI Governance, Risk & Compliance Training for Modern Businesses**
- Subhead: *Help your employees use AI safely, responsibly and compliantly while protecting your business from emerging risks.*
- Two primary CTAs: **[ Request a Demo ]** → `about.html#contact` · **[ Become a Partner ]** → `msp.html#become-a-partner`
- Keep the existing gate/blueprint visual treatment; only the copy + buttons change.

## Three-tier positioning (public, deliberately simple)
Show a tiers block on Home (and align `pricing.html`). One line each:
- **Tier 1 — AI Safe@Work Training** — "Train your people" → `course.html`
- **Tier 2 — AI Safe@Work Plus Pack** — "Get the governance toolkit" → `plus-pack.html`
- **Tier 3 — AI Governance Consultancy** — "Let us implement and manage AI governance for you" → `consultancy.html` (**COMING SOON**)
- MSP proposition: Course · Course + Plus Pack · Course + Plus Pack + Consultancy.

### Tier contents
**Tier 1 (course.html):** online course · knowledge assessment (quiz at end of
each module) · completion certificate · annual refresher training.

**Tier 2 (plus-pack.html) — the 10 documents:** AI Acceptable Use Policy ·
AI Use Case Register · AI Risk Assessment Template · AI Risk Register ·
AI Incident Form · AI Governance Roles Matrix · AI Steering Group Terms of
Reference · AI Vendor Due Diligence Assessment · AI Supplier Risk Assessment ·
Implementation Guide.

**Tier 3 (consultancy.html / phase-2.html) — COMING SOON, full catalogue:**
AI Health Check · AI Governance Gap Analysis · Policy Customisation · AI Risk
Workshops · AI Governance Framework Implementation · AI Supplier Reviews &
Assurance · AI Governance Steering Group Facilitation · AI Governance Roadmap
Development · Fractional AI Governance Officer Service · AI Governance Reporting
& KPI Development · AI Governance Audits & Reviews · ISO 42001 Readiness
Assessment · ISO 42001 Implementation Support · AI Management System Manual ·
AI Governance Charter · AI Objectives Register · AI Tool Register · Training
Register · AI DPIA Template · FRIA Template · ATRS Template · AI Internal Audit
Programme · AI Monitoring & KPI Dashboard · AI Governance Scorecard · AI
Awareness Poster · AI Executive Brief. (ISO is **Readiness**, never certification.)

## Course page (`course.html`) — trim
- KEEP: `#overview`, `#outcomes`, `#modules` (the 11 modules), `#certification`.
  Add the "annual refresher training" point (Tier 1).
- **REMOVE from the course page:** the Templates block, the Sector overlays
  block, and the Relevant Roles block (they were folded under `#modules`).
  - Templates now live in the **Plus Pack** (Tier 2).
  - Sector overlays + Relevant Roles become **marketing** assets — the
    standalone pages (`sector-*.html`, `module-{manager,dpo,…}.html`) stay live
    and reachable (footer/resources/MSP marketing), just not part of the course.

## Portals — MVP placeholders (roadmap, not full systems)
Keep existing auth + all Supabase code. Re-scope each portal's sub-nav/sections
to the MVP area list below; anything not yet built = labelled "Coming soon".
- **User Portal (`portal/end-user.html`)** — LMS MVP: **My Courses · Module Progress · Certificate Download**.
- **Customer Admin Portal (`portal/manager.html`)** — basic: **Add Users · Remove Users · View Completion % · Download Certificates**.
- **MSP Partner Portal (`portal/reseller.html`)** — **Marketing Materials · Rebate Information · Contact Form**. Licences/rebates/referrals are managed offline (Excel) initially; deeper deal/licence tooling is roadmap (keep existing code, demote/label).

## Definition of done (round 2)
1. Home hero shows the new headline + subhead + two CTAs (Request a Demo →
   `about.html#contact`, Become a Partner → `msp.html#become-a-partner`), both resolve.
2. A three-tier positioning block is visible with the three one-liners + the MSP proposition.
3. `course.html` no longer contains Templates / Sector overlays / Relevant Roles
   sections; still has overview/outcomes/modules/certification; mentions annual refresher.
4. `plus-pack.html` Governance Templates lists the 10 Tier-2 documents.
5. `consultancy.html` (Tier 3) lists the full catalogue, marked Coming Soon.
6. Each portal sub-nav matches its MVP area list; every area link resolves to an
   on-page section (real or "Coming soon" stub); existing Supabase code intact.
