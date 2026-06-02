# Two-entity structure — decision pending

> Closes `DOCTRINE.md § Open strategic TODOs → Two-entity (NewCo SaaS + Consultancy) structure decision: when, what jurisdiction, profit split`.
> Status: **DECISION PENDING**. This document captures the trade-offs so the decision can be made deliberately rather than under time pressure.

---

## Why two entities

Per `DOCTRINE.md § Strategic doctrine + growth framework → Commercial structure — hybrid SaaS + consultancy`:

- **Pillar 1 — Awareness SaaS** (the free core + paid subscriptions) is a software product with high gross margin, low marginal cost of delivery, and a customer-acquisition motion that scales with content and partners.
- **Pillar 2 — Governance Packs** sit between software and service: structured deliverables, partially productised, sold through MSPs.
- **Pillar 3 — Advisory + Consulting** is high-touch, day-rate, founder-led work with the opposite economics: high margin per day but does not scale.

Running both inside one legal entity has three foreseeable problems:

1. **Acquisition story muddles.** A potential SaaS acquirer wants to buy ARR, not a consulting practice. Mixing the two depresses multiple.
2. **Insurance + liability mix poorly.** Consulting carries Professional Indemnity claims; SaaS carries cyber + IP claims. One policy for both is more expensive and less coverage.
3. **Tax + dividend optimisation.** The SaaS entity may want to reinvest revenue; the consultancy may want to distribute profits. Same entity = same tax treatment = forced compromise.

Two entities lets each one optimise for its own customer + outcome.

---

## When to split — three trigger options

### Option A — Pre-launch split (do it before any revenue)

**Trigger:** Today. Set up both entities before the first paid customer or first signed Partner.

| Pros | Cons |
|---|---|
| Clean from day 1. Every invoice routes correctly without retrospective restructuring. | Higher upfront cost (~£2k-£5k in formation, lawyer, accountant setup). |
| No comingled history to unwind for an acquirer. | Founder has to decide jurisdiction + structure with very limited revenue data. |
| Two sets of insurance from day 1, neither carrying the other's risk profile. | Two annual filings, two bookkeeping accounts, two banking setups. Operational overhead for a solo founder. |

### Option B — Revenue-threshold split (do it when one Pillar exceeds £100k ARR / year)

**Trigger:** First Pillar to cross £100k ARR triggers the split. The other Pillar gets carved out into the second entity at the same time.

| Pros | Cons |
|---|---|
| Avoids paying setup costs before revenue justifies them. | Retrospective restructure has tax + IP-assignment friction; needs a competent accountant. |
| The revenue data informs which Pillar should be the "primary" entity for valuation purposes. | The first £100k+ year of trading is in a mixed entity; an acquirer will discount that period's contribution. |
| Operationally simpler for the early months. | The founder is busiest at exactly the moment the split is needed. |

### Option C — Acquirer-triggered split (do it when serious M&A interest appears)

**Trigger:** A credible acquirer signs an LoI on Pillar 1 (Awareness SaaS) and asks for the SaaS to be carved out cleanly.

| Pros | Cons |
|---|---|
| Avoids structure work that may never matter (if no acquirer appears). | Most expensive option — done under deal pressure with lawyer fees in the £20k+ range. |
| Aligns the structure decision with the moment it actually unlocks value. | The deal can stall or fall through over structure issues that would have been free to fix earlier. |
| Capital available to fund the restructure (deal financing). | Founder is signing the most consequential paperwork of the company life with the least leverage. |

### Provisional recommendation

**Option B (revenue-threshold)** with one important variant: pre-register the **name** and **trademark** of both entities now, even if only one is operating. That is ~£300 of trademark registration per jurisdiction, secures both names, and removes the worst-case scenario where Option B becomes blocked because someone else registered "AI Safe@Work Advisory Ltd" in the intervening period.

Founder's call. This document does not lock it in.

---

## Jurisdiction options

### UK Ltd × 2

| Pros | Cons |
|---|---|
| Founder is UK-resident; no cross-border tax complexity. | UK Corporation Tax is now 25% on profits > £250k; lower band for lower profits. |
| HMRC + Companies House are well-understood. Banking is solved. | Less attractive to certain acquirers who prefer Delaware. |
| English law is the default for any commercial contract with a UK or EU partner anyway. | UK is not in the EU; some EU customers prefer an EU-based vendor for data-residency reasons. |

### UK Ltd (SaaS) + Estonia OÜ (Consultancy via e-Residency)

| Pros | Cons |
|---|---|
| Estonia gives the consultancy entity an EU presence without physical office. Useful if EU customers ask. | Two jurisdictions × two tax filings × two banking setups. |
| Estonia OÜ corporate tax is 0% on retained profits, 22% on distributions only. | The consultancy entity's days are billable in EUR; FX exposure on conversion to GBP. |
| Founder qualifies for e-Residency (UK passport eligibility); set up is online + cheap. | Founder still pays UK personal tax on dividends received from Estonia OÜ. |

### Delaware C-Corp (SaaS) + UK Ltd (Consultancy)

| Pros | Cons |
|---|---|
| Default for US-acquirer M&A; ISO + 409A frameworks make valuations cleaner. | US tax registration even with no US revenue creates complexity. Form 5471 / 8858 etc. |
| Common for SaaS startups with VC ambitions. | Founder is UK-resident; double-tax treaty management is non-trivial. |
| Stock options easier to issue to future hires. | Materially more expensive ongoing (~£10k+/yr in accounting + legal). |

### Provisional recommendation

**UK Ltd × 2 today, with the option to flip the SaaS entity to a Delaware C-Corp** if and only if a credible US-led VC round or US acquirer materialises. This minimises ongoing cost during the bootstrap phase and preserves the option to upgrade jurisdiction later.

Founder's call.

---

## Profit-split + IP-assignment (proposed structure)

### Initial state at split time

- **NewCo SaaS** owns: course content, brand, domain, SaaS infrastructure, Partner contracts.
- **Consultancy** owns: founder day-rate engagements, advisory retainers, workshop deliveries.

### Inter-entity IP licence

NewCo SaaS licenses the course content + brand to the Consultancy on a **royalty-free, non-exclusive, perpetual** basis for the purpose of consulting delivery. The licence is documented in a written Inter-Company Agreement signed at the moment of split.

### Inter-entity referral fees

When Consultancy refers an Awareness SaaS deal to NewCo, NewCo pays Consultancy the same 20–30% referral fee structure that external Partners get (per the MSP commercial model). This is **not** intended as a tax-optimisation play; it is intended to make the consulting practice take SaaS referrals seriously by giving it direct revenue from doing so.

### Founder remuneration (initial proposal)

- Salary out of each entity at the level required to retain UK National Insurance status (currently £12,570 each, total £25,140).
- Dividends declared from each entity in proportion to that entity's retained profit and to the founder's tax-band optimisation.
- Reviewed annually with the accountant at financial year-end.

### Founder ownership

- 100% of each entity at split time.
- Any future ESOP / EMI scheme is established by amending the structure later; not in scope of the initial split.

---

## Sequence of events when the split happens

1. Decision made + recorded in the decision log of `DOCTRINE.md`.
2. New entity incorporated (Companies House + bank + accountant onboarded).
3. Trade-mark transferred or licensed appropriately.
4. Existing customer contracts assigned (with customer consent where required, novated where required).
5. Existing Partner agreements assigned (RORtech etc. — adds a sign-off step).
6. RoPA, sub-processor register, audit-pack files updated to reflect the entity that operates each surface.
7. Privacy policy, terms of service, MSP page, pricing page — all updated to name the correct entity per surface.
8. Pre-launch checklist evidence run for the changes that touch security-relevant surfaces (privacy policy + ToS edits are gate-bearing).

---

## Decision log

| Date | Decision | Trigger |
|---|---|---|
| 2026-06-02 | Document opened. Provisional recommendation: Option B (revenue-threshold) + UK Ltd × 2. **Decision not yet made.** | Doctrine § Open strategic TODOs |
| TBD | Decision made (founder) | — |
| TBD | Split executed | — |

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-06-02 |
| Decision date | **Pending** | — |
| Next review | Q3 2026 quarterly refresh, OR before the first £100k ARR Pillar threshold is reached, whichever is sooner. | — |
