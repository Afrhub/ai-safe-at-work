# DPIA — Own AI use for content authoring

> **Reg basis:** GDPR Art 35 (precautionary — not strictly required at current scale, but evidence that we think about it) · **Owner:** Founder · **Effective:** 2026-05-19 · **Next review:** 2026-08-19

## 1. Scope

We use commercial AI tools (Anthropic Claude, OpenAI ChatGPT, Anysphere Cursor) to author course material, including:

- Drafting module text
- Drafting templates (AUP, vendor questionnaire)
- Drafting documentation, ROPA entries, this DPIA itself
- Drafting code (HTML/CSS/JS for the site)
- Verifying citations against memory (NOT against live primary sources)

## 2. Nature of processing

We input:

- Public-figure professional-conduct facts (e.g. Mata v. Avianca, Arup deepfake, Samsung leak) — drawn from public reporting
- Generic clause text from published standards
- Drafts in our own voice

We do NOT input:

- Customer personal data (we have none yet)
- Confidential third-party material
- Anything covered by the never-paste list (we eat our own dog food)

## 3. Necessity and proportionality

- **Why AI?** Speeds drafting by 5–10×. Without it, the course ships months later, missing the EU AI Act Art 4 window.
- **Why these vendors?** Paid/team tier with training-opt-out; comprehensive DPAs; ISO 27001 / SOC 2 attested.
- **Are we processing more data than needed?** No — we deliberately keep customer-data flows out of AI tools.
- **Proportionate?** Yes — risk to data subjects (named public figures) is minimal; benefit (delivering the course) is high.

## 4. Risks identified

| Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|
| AI vendor changes terms retroactively to permit training | Low | High | Quarterly vendor review; ready to switch; opt-out reconfirmed; documented in `sub-processors.md` |
| Hallucinated content goes into the course | Medium | High | Two-source rule (Module 5 applied to ourselves); citations bibliography pass before each release |
| Public-figure mention is inaccurate / defamatory | Low | High | Cite primary source (court filings, regulator statements) — no characterisation beyond what is on the record |
| AI vendor security incident exposes our drafts | Low | Medium | No customer data in drafts; drafts are intended for public release anyway |
| Vendor shutdown blocks future revisions | Low | Low | Multi-vendor approach; content is markdown / HTML, portable |
| Inadvertent input of secrets (API keys etc) | Low | High | No secrets in repo; pre-commit hook planned to scan for tokens |

## 5. Mitigation already in place

- Tools used at paid tier with `do not train` on
- No customer data flows in (we have none)
- Every output is human-edited before publication
- Citations are walked against primary sources in the quarterly review
- Audit pack includes `ai-use-case-inventory.md`, `sub-processors.md`, this DPIA

## 6. Residual risk

Low. The principal residual risk is hallucinated content slipping into a published page. This is mitigated by the citations-bibliography pass and is documented openly with confidence flags (see `citations-bibliography.md`).

## 7. Decision

Proceed with AI-assisted authoring. Re-review quarterly with the next standards refresh.

## 8. Supervisory authority consultation

Not required at this scale. Will reconsider if:

- Customer data starts to flow into AI tooling, OR
- We start using AI to make decisions about real persons (employment, credit, etc.), OR
- ICO / CNIL guidance materially changes the threshold for prior consultation under Art 36.

## 9. Sign-off

| Role | Name | Date |
|---|---|---|
| Controller / Owner | Founder | 2026-05-19 |
| DPO (voluntary) | Founder | 2026-05-19 |

(When a second person joins the business, sign-off requires both.)
