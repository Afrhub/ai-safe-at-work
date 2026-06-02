# Sales partners

> Authoritative list of channel partners / authorised resellers / referrers for AI Safe@Work paid tiers. Mirror of doctrine § Sales partners. Per-partner agreement PDFs live alongside this file.
> Closes `DOCTRINE.md § MSP commercial model → Open TODOs → Draft MSP partner agreement template`.
>
> Folder layout:
> ```
> .audit/legal/partners/
>   README.md                              ← this file (template + inventory)
>   <partner-slug>.md                      ← one per onboarded partner
>   <partner-slug>-agreement.pdf           ← executed reseller agreement
>   <partner-slug>-rev-share-YYYY-QN.md    ← quarterly revenue reconciliation
> ```

## Active

| Partner | Type | Status | Onboarded | Territory | Tiers permitted | Margin/commission | Agreement file |
|---|---|---|---|---|---|---|---|
| RORtech Partners Limited | Authorised reseller | Onboarding · contract pending | 2026-05-19 | TBD (default: global) | TBD (default: all paid tiers) | TBD | `rortech-partners-ltd-agreement.pdf` (pending) |

## Inactive / terminated

(none)

## Pre-flight checklist for each new partner

- [ ] Reseller agreement signed (PDF in this folder)
- [ ] Partner legal entity verified (registered company number, registered address)
- [ ] AML / KYC checks done if EU
- [ ] Sub-processor disclosure made if partner touches customer personal data (`.audit/privacy/sub-processors.md` updated)
- [ ] DPA signed if applicable
- [ ] Brand guidelines shared
- [ ] Co-marketing terms agreed (default: no white-label without explicit clause)
- [ ] Deal-registration process explained
- [ ] First quarterly reconciliation date booked
- [ ] Partner contact added to incident notification list in `../breach-response-plan.md`

## Quarterly reconciliation

Each partner with revenue activity in a quarter gets a reconciliation entry at `.audit/legal/partner-revenue-YYYY-QN.md`. Pattern: gross sales · partner commission · net revenue to AI Safe@Work · invoices issued · disputes open.

## Termination triggers

Any of:

- Misrepresentation of accreditation status (we are not accredited; partners must not claim we are).
- Breach of confidentiality.
- Brand-guideline breach.
- Non-payment beyond 60 days.
- Failure to apply own-staff AUP to course-related work (see `../../ai/aup-own-staff.md` template — partners staff handling AI Safe@Work data should follow same posture).

Termination notice: 90 days written, either party.

---

## Template — MSP / reseller partner agreement (commercial summary)

This is a **commercial summary template**, not a legal contract. The legal contract is drafted from this template by a UK / EU commercial lawyer before any partner signs. Anything bracketed `[LIKE THIS]` is filled per partner.

### Parties

| Role | Entity |
|---|---|
| Licensor (us) | AI Safe@Work — current trading name; legal entity TBD per `../two-entity-structure-pending.md` |
| Partner | `[PARTNER LEGAL NAME]`, company number `[XXXXXXXX]`, registered office `[ADDRESS]` |

### Scope

The Partner is granted a **non-exclusive** right to resell, sublicense, deliver and co-brand AI Safe@Work paid products within the scope below:

- **Tier:** `[Partner MSP £499/mo | Growth MSP £1,499/mo | Strategic MSP £3-5k+/mo]` per `../msp-tier-feature-matrix.md`.
- **Territory:** `[Global default | Named ISO-3166 country list]`.
- **Products in scope:** `[All paid tiers | Awareness SaaS only | Governance Packs only | Advisory pass-through only]`.
- **Customer segments:** `[All SMB | Public sector excluded | Financial services excluded | etc.]`.

The free 12-module core remains free at point of use regardless of channel. The Partner does not have the right to charge end-users for access to free-core content.

### Revenue model

Per doctrine § MSP commercial model:

| Stream | Split (AI Safe@Work / Partner) |
|---|---|
| Awareness subscriptions (Partner-resold) | 70 / 30 |
| Governance packs | 50 / 50 |
| Workshops (Partner-delivered) | 30 / 70 |
| ISO/IEC 42001 projects (Partner-delivered) | 20 / 80 |
| Advisory retainers referred by Partner | 20–30% referral fee to Partner |

A **Founding MSP Partner** discount of `[50%]` Y1 may apply per `../founding-msp-partner-programme.md` and is reflected in the executed agreement.

### Term + termination

- **Initial term:** 12 months from execution.
- **Renewal:** auto-renew for successive 12-month periods unless either party serves 60-day non-renewal notice.
- **Termination for convenience:** either party with 90 days' written notice.
- **Termination for cause:** immediate, on the triggers listed in the section above.

### Sub-processor disclosure

If the Partner touches AI Safe@Work customer personal data, the Partner is added to `../../privacy/sub-processors.md` and the joint RoPA section is updated **before** any data flows.

### Branding + white-label

- **Co-branding** is permitted at the Growth tier and above.
- **White-label** is permitted only at the Strategic tier and only under a separate Schedule signed alongside this agreement.
- Either branding option requires the Partner to follow the AI Safe@Work brand guidelines verbatim. (Brand guidelines doc to be drafted.)
- The Partner does **not** modify course content without doctrine review.

### Audit + reporting

- The Partner provides a quarterly revenue statement (`<partner-slug>-rev-share-YYYY-QN.md`) within 30 days of quarter end. Format: number of seats per tier, gross revenue, AI Safe@Work share due.
- AI Safe@Work reserves the right to audit the Partner's seat count + revenue up to once per 12-month period with 14 days' notice. Self-funded by AI Safe@Work unless underpayment > 5% is found, in which case the Partner pays.

### Confidentiality

Mutual NDA for the term and 2 years thereafter. Standard knowledge-carve-out for information that becomes public through no fault of the receiving party.

### IP

- AI Safe@Work owns all course content (free core + paid).
- The Partner owns its own customer relationships, integrations, and any derivative work created by its delivery staff.
- Sector overlays or vertical packs commissioned jointly are co-owned per a Schedule signed at commission time.

### Liability

- Each party caps liability at the greater of (£25,000) or (the fees paid under this agreement in the prior 12 months).
- Excluded from cap: fraud, wilful misconduct, IP infringement claims, breach of confidentiality.

### Governing law + venue

English law. Courts of England and Wales. Mediation under CEDR Model Mediation Procedure before issuing proceedings.

### Schedules to attach per partner

- **Schedule A — commercial terms** (territory, tier, products, splits, Founding discount if applicable).
- **Schedule B — brand guidelines** (logo files, colour, voice, AUP for Partner-side use).
- **Schedule C — DPA** (UK GDPR / EU GDPR-compliant data-processing schedule; required only if the Partner touches AI Safe@Work customer personal data).
- **Schedule D — white-label terms** (Strategic tier only).

---

## How to onboard a new partner

1. Copy this README's commercial summary into `<partner-slug>.md`.
2. Fill the bracketed fields. Get partner sign-off on the commercial summary first (saves legal hours).
3. Hand the filled commercial summary to a UK / EU commercial lawyer for the legal draft.
4. Once signed, drop the executed PDF as `<partner-slug>-agreement.pdf`.
5. Update doctrine `§ Sales partners` partner table with the new row.
6. Update `../../privacy/sub-processors.md` if customer personal data flows Partner-side.
7. Run the pre-launch checklist evidence step for the change — this is a new commercial surface, gate-bearing.

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-06-02 |
| Next review | Q3 2026 quarterly refresh, OR before the first partner signature, whichever is sooner | — |
