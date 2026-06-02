# Founding MSP Partner programme — specification

> Closes `DOCTRINE.md § MSP commercial model → Open TODOs → Draft Founding MSP Partner programme spec (5-slot cap, terms, exclusivity rules)`.
>
> Doctrine reference: `DOCTRINE.md § MSP commercial model → Founding MSP Partner programme`.

---

## Purpose

The Founding MSP Partner programme exists to do three things in one move:

1. **De-risk the first commercial launch.** The first 1–5 MSPs to commit are signing during the doctrine-locked, pre-public-pricing phase. They get a discount commensurate with the operational risk they are absorbing.
2. **Earn roadmap input.** Founding partners shape what gets built in Phase 1 (governance packs, sector overlays, tools / dashboards) by virtue of being in the room before the roadmap is public.
3. **Create FOMO that closes the next cohort.** Once 1–2 Founding slots are signed and the programme is announced publicly, the remaining slots close inside 90 days at a discount that is materially worse for late entrants.

This document is the **commercial specification** for the programme. It is the source of truth for what the Founding offer **is**. Each individual partner gets a signed Founding Partner Schedule attached to their main reseller agreement; the Schedule cites this document.

---

## Slot cap

- **5 slots total.**
- No more than **3 slots** allocated within any single geography (UK + Ireland counts as one geography for the purpose of this cap).
- No more than **2 slots** allocated within any single sector vertical (e.g. financial services, healthcare, public sector). This is to prevent the founding cohort from being lopsided in market signal.
- A waitlist beyond slot 5 is permitted and gets converted into standard-tier pricing automatically.

---

## Programme terms (default, per slot)

| Item | Default for Founding Partners |
|---|---|
| Y1 monthly tier fee discount | **50% off** the per-tier monthly (Partner £499 → £249 · Growth £1,499 → £749 · Strategic £3-5k → £1.5-2.5k) |
| Y2 tier fee | 25% off |
| Y3 tier fee | Full rate from start of Y3 |
| Revenue share | Standard splits per `DOCTRINE.md § MSP commercial model`, no Founding-only enhancement |
| Roadmap input | One 90-min quarterly roadmap-shaping session with Founder + first written response within 14 days on any Founding-Partner feature request |
| Co-branding | Permitted from day 1 (normally Growth tier and above), under the brand guidelines |
| White-label | NOT permitted by default for Founding Partners. Requires separate negotiation and an additional Schedule. Reason: we want their delivery to be visibly AI Safe@Work-branded during the programme's marketing-effect window. |
| Logo placement on `msp.html` | Permitted, opt-in. AI Safe@Work places the partner logo on the public MSP partner page within 14 days of opt-in signal. |
| Public case study | One within Y1, written by AI Safe@Work, partner-approved before publication. |
| Founding badge / digital asset | AI Safe@Work issues a "Founding MSP Partner — 2026" digital badge for use in partner marketing for the life of the programme |
| Exclusivity | NOT granted by default. Geographic and sector limits in the slot-cap section above act as soft-exclusivity (you will not be one of more than 3 in your country or more than 2 in your sector). |
| Negotiated exclusivity (geo or sector) | Permitted **only** at the Strategic tier AND only with a documented commercial commitment from the partner (e.g. minimum monthly revenue commitment, minimum customer-acquisition commitment). Recorded in the partner's Schedule A. |

---

## Eligibility

To qualify for a Founding Partner slot, an MSP must meet all of the following:

1. Registered legal entity in a jurisdiction AI Safe@Work can transact with (UK, EEA, US, Canada, AU/NZ as default; other jurisdictions case-by-case).
2. Active managed-services customer base of at least **25 SMB customers** OR a track record of MSP delivery exceeding 24 months.
3. Either (a) the Partner already has a security / IT-services revenue line we can plug into, OR (b) the Partner is actively building one and AI Safe@Work is part of the entry strategy.
4. Sign-off from the Partner's commercial decision-maker — not a sales rep — before contract draft begins.
5. Successful completion of the on-boarding pre-flight checklist in `.audit/legal/partners/README.md`.
6. Mutual NDA executed before AI Safe@Work shares the doctrine, partner pack, or unannounced roadmap.

A Partner that does not meet (2) may still be accepted if they meet a **strategic** criterion that the Founder explicitly documents in the partner's `.md` file (e.g. they are the first partner in a target sector and that strategic value substitutes for raw customer count).

---

## Allocation process

1. Inbound interest is logged in `.audit/legal/partners/<slug>.md` as "Status: Founding-track interest".
2. The Founder makes a written allocation decision within 14 days of the eligibility check completing.
3. Slot allocation is **chronological by signed Founding Schedule**, NOT by inbound interest. The first MSP to actually sign takes Slot 1, regardless of who registered interest first.
4. RORtech Partners Limited has provisional Slot 1 hold per `DOCTRINE.md § Sales partners` and `.audit/legal/partners/rortech-partners-ltd.md`. The hold expires automatically if the Founding Schedule is not signed within 90 days of programme launch.
5. Once Slot 5 is signed and announced, all remaining inbound interest converts automatically to standard-tier reseller terms (no Founding discount, no roadmap session, no logo placement on msp.html unless commercially negotiated separately).

---

## Programme launch + announcement

Public announcement of the Founding programme is gated on:

- At least 1 Founding Partner Schedule signed.
- Doctrine v6 (or whichever doctrine version captures the public-announce decision) committed and pushed.
- `msp.html` lifted from `noindex` AND showing the Founding badge + slot-counter strip.

Announcement channels:

- Public note on `msp.html` ("`N of 5 Founding MSP Partner slots remaining`").
- LinkedIn post by Founder, tagging the first signed partner.
- Direct email to the inbound-interest list maintained at `.audit/legal/msp-inbound-interest.md` (to be created on first inbound).

Once announced, the slot-counter on `msp.html` is updated within 24 hours of each new signature.

---

## What ends the programme

Three trigger conditions, any one ends new Founding allocations:

1. **All 5 slots signed.** Programme is complete; standard-tier pricing applies to any new MSP.
2. **18 months elapsed since programme launch and fewer than 5 signed.** Programme converts to a smaller "Early Partner" tier with reduced discount (e.g. 25% Y1, no Y2 discount, no roadmap session). Existing Founding Partners keep their original terms.
3. **AI Safe@Work pivots strategy in a way that materially changes the MSP-first route to market.** Existing Founding Partners keep their original terms; programme is paused for new entrants pending strategic update.

In all three cases, existing Founding Partner Schedules are honoured for their full term.

---

## Operational TODOs to land before first Founding signature

- [ ] Draft and lawyer-review the Founding Partner Schedule (extends the standard reseller agreement).
- [ ] Build the Founding badge digital asset (SVG + PNG + transparent).
- [ ] Set up `msp.html` slot-counter strip (currently the page is `noindex`).
- [ ] Set up the quarterly roadmap-session calendar template.
- [ ] Create `.audit/legal/msp-inbound-interest.md` for the waitlist.
- [ ] Decide pricing-page treatment: Founding discount visible publicly or only quoted on application.

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-06-02 |
| Next review | Q3 2026 quarterly refresh, OR before the first Founding Partner signature, whichever is sooner. | — |
