# Risk register

> **Owner:** Founder · **Effective:** 2026-05-19 · **Review:** quarterly · **Scoring:** Likelihood (L 1–5) × Impact (I 1–5) = Risk score (RS); reviewed at RS ≥ 6

| # | Risk | L | I | RS | Owner | Mitigation | Status |
|---|---|---|---|---|---|---|---|
| 1 | Content goes stale; standards move faster than refresh | 4 | 4 | 16 | Founder | Quarterly refresh cadence; subscribed mailing lists; banner if 2 cycles missed | Active mitigation |
| 2 | Hallucinated content in published modules causes reputational / legal harm | 3 | 5 | 15 | Founder | Two-source rule on every citation; citations-bibliography pass per release; confidence flags published openly | Active mitigation |
| 3 | Bus factor 1 — founder unavailable, course rots | 3 | 5 | 15 | Founder | Public repo; documented doctrine; quarterly scheduled actions; recoverable by another person | Partial |
| 4 | AI vendor changes terms (training opt-out removed) silently | 3 | 4 | 12 | Founder | Quarterly vendor review; terms-snapshot stored per quarter; multi-vendor approach | Active mitigation |
| 5 | Sub-processor breach exposes our drafts | 2 | 3 | 6 | Founder | No customer data in drafts; minimal sub-processor surface | Accept |
| 6 | Phishing / social-engineering on founder account | 3 | 5 | 15 | Founder | MFA on every account; password manager; ongoing awareness | Active mitigation |
| 7 | Site hosting failure / DNS misconfig taking site offline | 2 | 3 | 6 | Founder | Static-only; git-deploy; mirror-able; domain auto-renew | Accept |
| 8 | Accessibility complaint / WCAG non-conformance blocking public-sector procurement | 4 | 3 | 12 | Founder | Accessibility audit + statement published; quarterly smoke | Plan |
| 9 | Defamation claim from competitor we name in positioning | 1 | 4 | 4 | Founder | Public copy stays factual; doctrine internal; "different audience" framing | Accept |
| 10 | Regulator names us negatively in guidance | 1 | 5 | 5 | Founder | Conservative wording; citations openly flagged; ready to amend | Accept |
| 11 | Bad actor uses course as cover for non-compliance | 3 | 2 | 6 | Founder | Explicit disclaimer on standards-map and terms; "this is not certification" | Active mitigation |
| 12 | Knowledge-check JS breaks an LMS deployment | 3 | 2 | 6 | Founder (future) | SCORM conformance test against multiple LMS before customer hand-off | Plan |
| 13 | Burnout / motivation loss | 3 | 5 | 15 | Founder | Quarterly milestones; public commits; doctrine-locked discipline | Accept |
| 14 | EU AI Act enforcement is weak; demand softens | 3 | 3 | 9 | Founder | Pivot copy emphasis to security-awareness framing if needed; ISO 27001 A.6.3 always bites | Plan |
| 15 | Free-core never converts to paid overlays | 4 | 4 | 16 | Founder | Embedded CTA on every module footer; capture email on template downloads | Plan |
| 16 | GDPR breach via our own infrastructure | 2 | 5 | 10 | Founder | Currently zero forms / zero PII = zero breach surface; treat any change to this as crown-jewel risk | Active mitigation |
| 17 | Translation gap loses EU market | 4 | 4 | 16 | Founder | FR + DE planned (per doctrine); reuse win2linux pipeline | Plan |
| 18 | Pivot before product matures | 3 | 5 | 15 | Founder | Doctrine locked; quarterly review forcing function | Active mitigation |
| 19 | Search ranking never lands | 3 | 4 | 12 | Founder | JSON-LD + sitemap + OG shipped; quarterly content depth | Active mitigation |
| 20 | Procurement deals stall on SCORM gap | 4 | 3 | 12 | Founder | SCORM wrapper before pricing launches | Plan |

## Review checklist (quarterly)

- [ ] Re-score each risk
- [ ] Add new risks observed since last review
- [ ] Close risks no longer relevant (date the closure)
- [ ] If any RS ≥ 12 without active mitigation, escalate to doctrine review

## Acceptance / transfer / mitigate / avoid

Treatment column above uses: **Active mitigation** (controls in place, reviewed) · **Plan** (controls scheduled, not yet in place) · **Accept** (residual risk low or cost of mitigation exceeds expected loss) · **Transfer** (insurance — currently none; planned).
