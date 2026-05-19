# AI use-case inventory

> **Reg basis:** ISO/IEC 42001 Cl 6.1 + Annex A.5.2 · EU AI Act Art 26 (deployer) · **Owner:** Founder · **Effective:** 2026-05-19 · **Review:** quarterly

Every AI use the business performs, in any tool, for any purpose.

## UC-01 — Authoring course content

| Field | Value |
|---|---|
| Use case | Drafting module text, templates, audit-pack docs, this inventory |
| Tools | Anthropic Claude (paid), OpenAI ChatGPT (paid backup) |
| Tier | Team / Paid — training opt-out confirmed |
| Data in | Public-figure professional-conduct facts; clause text from public standards; our own drafts |
| Data out | Drafts in markdown / HTML; reviewed and edited by human before publication |
| Decisions affected | None affecting persons; affects which words appear on a public site |
| Human in loop | Yes — every output edited; nothing goes live untouched |
| EU AI Act tier | Minimal risk |
| Approver | Founder |
| Logged in | git commits |

## UC-02 — Drafting code

| Field | Value |
|---|---|
| Use case | HTML/CSS/JS for site; helper scripts in `.audit/` |
| Tools | Cursor (paid), Claude, ChatGPT |
| Tier | Paid |
| Data in | Source code; no secrets; no PII |
| Data out | Code, reviewed and tested before commit |
| Decisions affected | None affecting persons |
| Human in loop | Yes |
| EU AI Act tier | Minimal risk |
| Approver | Founder |
| Logged in | git commits |

## UC-03 — Verifying citations (training-data lookup only)

| Field | Value |
|---|---|
| Use case | First-pass verification of clause numbers, article numbers, case citations against AI training knowledge |
| Tools | Claude, ChatGPT |
| Tier | Paid |
| Data in | Citation queries — public regulatory references |
| Data out | Claims about what the standard / case says |
| Decisions affected | Confidence flags in `citations-bibliography.md` |
| Human in loop | Yes — every claim flagged for primary-source check during quarterly review |
| EU AI Act tier | Minimal risk |
| Approver | Founder |
| Limit | AI is NOT the final verification — primary source is. Confidence column in bibliography reflects this |

## UC-04 — Drafting communications (future)

| Field | Value |
|---|---|
| Use case | First drafts of replies to readers / customers |
| Tools | Claude / ChatGPT |
| Tier | Paid |
| Data in | The original message we received; will contain personal data of senders |
| Data out | Draft reply; edited before sending |
| Decisions affected | None affecting persons; affects tone and content of replies |
| Human in loop | Yes — always |
| EU AI Act tier | Minimal risk |
| Approver | Founder |
| Special handling | If the message contains special-category data, AI drafting is NOT used — reply written manually |

## Decommissioned use cases

(none)

## Lifecycle

- New use case: documented here BEFORE first use.
- Material change to a use case (new tool, tier change, scope expansion): re-record with `revised YYYY-MM-DD`.
- Vendor change for an existing use case: update; re-walk vendor questionnaire response from new vendor.
