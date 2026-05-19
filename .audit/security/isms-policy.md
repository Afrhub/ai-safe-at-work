# Information Security Management — Policy (one-pager)

> **Owner:** Founder · **Effective:** 2026-05-19 · **Review:** annual + on material change

## Statement

AI Safe@Work treats information security as a foundational obligation. We are a course-creation business, and our credibility depends on practising what we teach. This policy aligns with ISO/IEC 27001:2022 and informs every supplier choice, every code commit, every operational habit.

## Scope

All information assets owned, processed, or handled by the business — repositories, hosting, email, financial records, AI vendor accounts, devices used.

## Principles

1. **Least data.** Don't collect what we don't need.
2. **Least access.** Each person (currently founder; later: staff) gets only the access required.
3. **Least vendors.** Fewer suppliers = fewer breach surfaces. Each vendor is justified, reviewed quarterly.
4. **Encryption by default.** Data in transit (HTTPS) and at rest (provider-managed) for everything.
5. **Logging and traceability.** Every meaningful action leaves a record.
6. **No secret in plaintext.** API keys, passwords, tokens live in a secret manager. Never in repos, never in chat, never in screenshots.
7. **Eat the dogfood.** Follow the AUP (`.audit/ai/aup-own-staff.md`) for our own AI use.
8. **Quarterly review.** Risks change; this policy gets re-read.
9. **Transparent incident handling.** When something goes wrong, the breach-response plan runs; nothing is hidden.

## Roles

- **Owner:** Founder, until a CISO / equivalent is appointed.
- **Reviewer of access changes:** Founder.
- **Incident commander:** Founder, with delegation when a second team member exists.

## Related artefacts

- `.audit/security/risk-register.md`
- `.audit/security/asset-register.md`
- `.audit/security/access-control.md`
- `.audit/security/incident-log.md`
- `.audit/privacy/breach-response-plan.md`
- `.audit/ai/aup-own-staff.md`

## Enforcement

This policy is binding on every person performing work for AI Safe@Work. Deviations need written approval from the Owner, recorded as an exception entry.
