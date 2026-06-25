# AI Safe@Work — Architecture & Security Overview

*Leave-behind for partner / procurement technical review. Not for public publication.*

## Platform at a glance
A managed, cloud-native SaaS — **no hand-operated servers to patch or fail**.

| Layer | What runs it | Where |
|---|---|---|
| Frontend | Static application delivered from a global CDN edge | Multi-region edge |
| Data & auth | **Managed PostgreSQL + identity** (Supabase) | **AWS, eu-west-2 — London** |
| Security boundary | PostgreSQL Row-Level Security (RLS) | Enforced in the database |

The browser only ever holds a **publishable (anon) key**; all data access is mediated by Row-Level Security in the database. There is no application server holding privileged credentials to compromise.

## Data residency & compliance
- **UK / EU data residency** — all customer data is stored in **AWS London (eu-west-2)**. Clean answer for UK GDPR and EU buyers.
- Architecture and controls map to the same standards the product itself teaches: **EU AI Act (Art. 4), GDPR, ISO/IEC 42001, ISO/IEC 27001.**

## Access control & tenant isolation
- **Row-Level Security on every table**, scoped per user — confirmed live: an unauthenticated request returns *no* data.
- **Least privilege:** end-users, customer admins (managers) and partners (resellers) each see only their own tenant's rows. Privileged operations (seat assignment, credits) run only through controlled, server-side routines.
- Verified by independent review and by the platform's own automated security advisor.

## Authentication
- Email + password with **mandatory multi-factor authentication (TOTP, AAL2)** — no portal content renders until MFA is satisfied.
- Same-origin redirect protection; configurable auth rate-limiting and breached-password screening.

## Auditability
- **Append-only, tamper-resistant audit log** of privileged actions (role/credit changes, seat assignment, deal lifecycle) — invisible and immutable to end-users, readable only by administrators.
- Training completion is recorded through **server-side grading** (answer keys never reach the browser) so completion evidence cannot be forged — the integrity an auditor expects.

## Application security posture
- **Full OWASP Top 10 review completed and remediated** (Critical / High / Medium all fixed; dated, version-controlled migration trail as evidence).
- **HTTPS everywhere** with HSTS preload; **strict Content-Security-Policy** (no inline script); clickjacking protection (`frame-ancestors 'none'`); MIME-sniffing and referrer hardening.
- **No secrets in source control**; third-party dependencies pinned; supply-chain hygiene.

## Scalability & resilience
- Comfortably serves **50,000+ users with no re-architecture** — the frontend is CDN-delivered (effectively unlimited) and the database scales vertically on a slider.
- **Daily backups + Point-in-Time Recovery** (managed); documented restore procedure.
- No single self-managed server = no single patching/failover liability.

## Why this stack (for the technical reviewer)
Modern SaaS frontends are static apps on a CDN; the seriousness is in the **data, identity and control plane** — which here is **managed PostgreSQL on AWS London with enforced RLS, MFA and audit**. This is a deliberately boring, defensible, compliance-aligned architecture, not a bespoke server estate to operate.

---
*Production environment served from `app.aisafeatwork.org` (HTTPS). Hosting can be delivered via enterprise edge (Cloudflare/CloudFront) on request; data plane remains AWS London.*
