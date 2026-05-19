# Records of Processing Activities (RoPA)

> **Reg basis:** GDPR Article 30 · **Controller:** AI Safe@Work (sole-trader, until incorporation) · **DPO:** voluntary contact = founder (documented decision in `dpo-appointment.md`) · **Effective:** 2026-05-19 · **Reviewed:** quarterly per `refresh-cadence.md`

This register lists every processing activity in scope. Empty / minimal entries are kept intentionally — silence is evidence too.

## Activity 1 — Public website serving

| Field | Value |
|---|---|
| Activity | Serving the static AI Safe@Work site to readers |
| Purpose | Educational content delivery |
| Categories of data subjects | Anyone who fetches a page; no profiling, no account |
| Categories of personal data | Server logs (IP address + user agent + URL + timestamp) at the hosting layer; no application-layer storage |
| Source | Direct from data subject (their browser) |
| Recipients (sub-processors) | Hosting provider (Cloudflare Pages / Netlify — TBD on production); Google Fonts (font CSS only) |
| International transfer | Hosting provider may be outside EU/EEA; relying on SCCs in vendor DPA |
| Retention | Server logs per hosting provider default (typically 30 days, configurable down) |
| Lawful basis | Art 6(1)(f) — legitimate interest in operating the website |
| Special-category data? | No |
| Security measures | HTTPS only; no application-layer storage; static HTML; CSP planned |
| Records of decisions | None — purely informational reads |

## Activity 2 — Use of AI tools to author content

| Field | Value |
|---|---|
| Activity | Drafting course material with AI assistance (Claude, ChatGPT, Cursor) |
| Purpose | Internal content production |
| Categories of data subjects | None — we draft about hypothetical scenarios, named public incidents, and primary-source clause text. No real customer data flows in |
| Categories of personal data | Names of public figures in named-incident discussion (Mata v. Avianca attorneys, etc.); these are processed for journalistic purposes and from public sources |
| Source | Public records, court filings, journalism |
| Recipients (sub-processors) | Anthropic (Claude), OpenAI (ChatGPT), Anysphere (Cursor) under their enterprise/team-tier DPAs where applicable; settings on `do not train on our conversations` confirmed |
| International transfer | Likely US sub-processors; SCCs in vendor DPAs |
| Retention | Per vendor default; chat history not relied upon long-term |
| Lawful basis | Art 6(1)(f) legitimate interest; Art 9(2)(e) data manifestly made public, for the public-figure cases |
| Special-category data? | No — public-figure professional conduct only |
| Security measures | Vendors used at paid/team tier with training-opt-out; no customer data ingested |
| Records of decisions | `ai-use-case-inventory.md` in `.audit/ai/` |

## Activity 3 — Communication with the public

| Field | Value |
|---|---|
| Activity | Receiving messages from readers (corrections, complaints) when channels are added |
| Purpose | Customer-service / complaints handling |
| Categories of data subjects | Readers who proactively contact us |
| Categories of personal data | Email address; message content; potentially name |
| Source | Direct from data subject |
| Recipients | Email provider (TBD on launch) under DPA |
| International transfer | Per provider; SCCs in DPA |
| Retention | 24 months from last contact, then deletion |
| Lawful basis | Art 6(1)(b) contract / pre-contract or Art 6(1)(f) legitimate interest depending on context |
| Special-category data? | Not solicited; if received, deleted immediately and the sender notified |
| Security measures | Provider-managed encryption; MFA on inbox |
| Records of decisions | Future correspondence log |

## Activity 4 — (Planned) Commercial customer accounts

| Field | Value |
|---|---|
| Activity | Customer accounts for paid offerings (SCORM pack, templates pack, managed delivery) |
| Status | **Not yet operational** — placeholder for forward planning |
| Categories of data subjects | Customer contacts (admin, billing) |
| Categories of personal data | Name, email, billing address, possibly company VAT ID |
| Source | Direct from customer at point of purchase |
| Recipients | Payment processor (Stripe planned) under DPA; potentially analytics product (none yet) |
| International transfer | Stripe — SCCs in DPA |
| Retention | Active relationship + 7 years for tax purposes after closure |
| Lawful basis | Art 6(1)(b) contract |
| Special-category data? | No |
| Security measures | Tokenisation by Stripe; no card data stored; MFA on admin accounts |
| Records of decisions | Will be added when activated |

## Update protocol

- Re-walked quarterly per `refresh-cadence.md`.
- New activity is added BEFORE the activity begins, not after.
- Closed activities are not deleted — marked `terminated YYYY-MM-DD` with reason.
- This file is the single source of truth that an auditor will be shown. Drift between it and reality is the worst possible audit finding.
