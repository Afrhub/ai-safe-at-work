# Data retention schedule

> **Reg basis:** GDPR Art 5(1)(e) — storage limitation · **Owner:** Founder · **Effective:** 2026-05-19

Per data category, how long we hold it and what triggers deletion.

| Data category | Retention period | Trigger to delete | Where held |
|---|---|---|---|
| Server logs (IP, UA, URL, time) | Hosting provider default (typically 30 days) | Rolling — never manually intervene | Hosting provider |
| Email correspondence with readers | 24 months from last contact | Quarterly delete pass on emails older than threshold | Email provider |
| Customer account data (planned) | Duration of active relationship + 7 years post-closure (tax law) | Account closure + retention timer expiry | Payment provider + own records |
| Financial records (invoices, accounts) | Statutory minimum, typically 6–10 years | End of statutory period | Bookkeeping system |
| AI-vendor chat history | Per vendor default (typically 30 days unless paid tier extended) | Vendor-managed | Vendor |
| Training records (own staff completion) | Duration of employment + 6 years (for audit defence) | End of retention timer | Training register |
| Incident log entries | 10 years (defensive evidence) | Manual review at year 10 | Audit pack |
| Audit-pack documents (ROPA, DPIAs, etc.) | Indefinite while business operates; 10 years post-cessation | n/a while operating | Audit pack |
| Insurance correspondence | 10 years post-policy-end | End of retention timer | Insurance file |

## Deletion process

1. Quarterly: founder runs deletion pass on email and any other manual-cycle stores.
2. Annual: review this schedule against any new regulatory guidance.
3. On request: data-subject access / erasure requests handled per `data-subject-rights.md` (TODO file).

## Exceptions

- Where statutory law mandates longer retention (e.g. tax), the statutory minimum overrides this schedule.
- Where active investigation, dispute, or insurance claim is in progress, retention is extended until resolution + 12 months.
