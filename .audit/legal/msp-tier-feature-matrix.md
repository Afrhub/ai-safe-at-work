# MSP tier feature matrix

> Closes `DOCTRINE.md § MSP commercial model → Open TODOs → Build per-tier feature matrix (Tier 1 vs Tier 2 vs Tier 3) for MSP onboarding pack`.
>
> Doctrine reference: `DOCTRINE.md § MSP commercial model → MSP pricing tiers + Revenue share`.

---

## At-a-glance

| Tier | Monthly fee | For |
|---|---|---|
| **Partner MSP** | £499/mo | Smaller MSPs · early partners · adoption testing |
| **Growth MSP** | £1,499/mo | Established MSPs · active customer rollout |
| **Strategic MSP Partner** | £3,000–£5,000+/mo (priced per agreement) | Serious growth partnerships · exclusivity options |

Founding MSP Partner discount (per `founding-msp-partner-programme.md`): **50% off Y1**, 25% off Y2, full rate from Y3.

---

## Feature matrix

| Feature | Partner MSP (£499/mo) | Growth MSP (£1,499/mo) | Strategic MSP (£3-5k+/mo) |
|---|---|---|---|
| Resell awareness subscriptions | ✓ | ✓ | ✓ |
| Resell governance packs | ✓ | ✓ | ✓ |
| Deliver workshops (rev share 30/70) | ✓ | ✓ | ✓ |
| Refer ISO/IEC 42001 projects (rev share 20/80) | ✓ | ✓ | ✓ |
| Refer advisory retainers (20–30% referral fee) | ✓ | ✓ | ✓ |
| Co-branded marketing (logo alongside ours) | ✗ | ✓ | ✓ |
| White-label (Partner-only logo, no AI Safe@Work reference visible to end-user) | ✗ | ✗ | ✓ (via separate Schedule D) |
| Custom domain for white-label | ✗ | ✗ | ✓ |
| Multi-tenant admin dashboard | ✗ | ✓ (read-only) | ✓ (full) |
| Direct slack channel with Founder | ✗ | ✓ (response 48 hr) | ✓ (response 24 hr) |
| Quarterly roadmap-shaping session | ✗ | ✗ | ✓ |
| Founding Partner badge (if Founding cohort) | ✓ if Founding | ✓ if Founding | ✓ if Founding |
| Logo placement on public `msp.html` | Opt-in | Opt-in | Opt-in + featured |
| Bulk-import customer accounts | ✗ | ✓ (≤ 100/batch) | ✓ (unlimited) |
| SCORM 1.2 / xAPI export (when shipped) | ✓ | ✓ | ✓ |
| Sector overlay access (when shipped) | Per-pack add-on | 2 included | All included |
| Custom sector overlay commissioned with revenue-share variance | ✗ | ✗ | ✓ |
| Geographic exclusivity (soft, via Founding slot caps) | If Founding | If Founding | Negotiable per Schedule A |
| Geographic exclusivity (hard, contractual) | ✗ | ✗ | ✓ (with documented commercial commitment) |
| Sector exclusivity | ✗ | ✗ | ✓ (with documented commercial commitment) |
| Support SLA — Partner-side tickets | Email · 5 business days | Email + Slack · 2 business days | Email + Slack · 1 business day |
| Support SLA — end-user tickets routed via Partner | N/A (Partner handles L1/L2) | N/A | N/A — Partner is L1/L2; AI Safe@Work is L3 escalation |
| Joint quarterly business review (QBR) | ✗ | ✓ (60 min virtual) | ✓ (90 min, in-person if both EU) |
| Onboarding pack: brand assets + objection-handler + ROI calculator | ✓ | ✓ | ✓ |
| Onboarding pack: pitch deck (per-Partner customised) | ✗ | ✗ | ✓ |
| Quarterly revenue reconciliation | ✓ | ✓ | ✓ |
| Audit right exercised by AI Safe@Work | Up to 1× per 12 mo | Up to 1× per 12 mo | Up to 2× per 12 mo |

---

## Revenue share — applies to all tiers identically

Per `DOCTRINE.md § MSP commercial model`:

| Stream | Split (AI Safe@Work / Partner) |
|---|---|
| Awareness subscriptions (Partner-resold) | 70 / 30 |
| Governance packs | 50 / 50 |
| Workshops (Partner-delivered) | 30 / 70 |
| ISO/IEC 42001 projects (Partner-delivered) | 20 / 80 |
| Advisory retainers referred by Partner | 20–30% referral fee to Partner |

**Founding Partners get the same revenue share — the Founding discount applies only to the monthly tier fee.** That ratio is deliberate per doctrine: "do NOT extract all value from platform subscription up front. Revenue lives in distribution + expansion + governance upsells + consulting."

---

## How to use this matrix

- **For inbound MSPs**: hand them this file (or a PDF export of it) as part of the discovery conversation.
- **For Founder commercial decisions**: this is the source of truth for what an offer includes at each tier. If a question comes up that is not in this matrix, the answer is either "Strategic-tier only", "negotiable per Schedule", or "no" — never "yes" without updating this file.
- **For the lawyer drafting the Schedules**: Schedule A draws its commercial terms from this matrix. Any divergence in a per-Partner Schedule must be noted in that Partner's `<slug>.md` file and reviewed at quarterly QBR.

---

## Open items

- Multi-tenant admin dashboard (referenced in Growth + Strategic tiers): currently spec-only per `DOCTRINE.md § MSP commercial model → Open TODOs → Build multi-tenant dashboard spec`. Until shipped, "✓" on those rows is a forward-looking commitment; the dashboard is not deliverable as of 2026-06-02 and any sign-up at Growth or above includes a written acknowledgement of the delivery date.
- Sector overlays (referenced in tier rows): outlined in `.audit/course-quality/sector-overlays/`; not yet packaged for sale.
- Custom domain / white-label tooling: not built; Strategic tier sign-ups commit to a delivery date defined per contract.

These three items are the **delivery dependencies** that the first Growth-tier or higher signature should be paired with — sign the Partner, set a defined date for each pending deliverable, do not promise "available now" for anything still in `.audit/`.

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-06-02 |
| Next review | Q3 2026 quarterly refresh, OR before any pricing-page lift from `noindex`, whichever is sooner. | — |
