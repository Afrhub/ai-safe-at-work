# Acceptable Use of AI Tools — own staff

> Filled-in instance of our own [public AUP template](../../templates/aup-template.html). **Eat the dogfood.**

**Effective:** 2026-05-19 · **Version:** 1.0 · **Owner:** Founder · **Review cycle:** Quarterly

## 1. Purpose

This policy describes how staff at **AI Safe@Work** (currently: the founder, solo operator) may use generative AI tools in the course of work. It sets out what is encouraged, what is permitted with conditions, and what is forbidden, in order to protect the business, our customers, our employees, and ourselves.

## 2. Scope

1. This policy applies to the founder and to any future employees, contractors, interns, or consultants performing work for AI Safe@Work.
2. It applies on company-owned and personally-owned devices used for work.
3. It covers all AI tools, whether procured by the business or used personally for work purposes.

## 3. Approved tools

1. **Anthropic Claude** — paid tier; training opt-out confirmed.
2. **OpenAI ChatGPT** — paid tier; training opt-out confirmed.
3. **Cursor** — paid tier; Privacy Mode enabled; no codebase indexing.

Other tools require explicit decision in the next quarterly review before being used for work-related tasks. Free or paid-individual versions of consumer AI tools are not approved for work involving the data categories in section 5.

## 4. Permitted uses

Subject to sections 5 and 6, AI tools may be used to:

- Draft course content, templates, documentation, audit-pack files, code.
- Summarise public clause text, primary sources, academic / professional commentary.
- Translate / rephrase public content.
- Brainstorm strategy and product decisions (no customer-specific data involved).
- Explain unfamiliar legal / standards text in plain English (followed by primary-source verification).
- Code / scripts / formulas where no production secrets or customer data appear in the prompt.

## 5. Forbidden inputs

The following must not be entered into any AI tool, even the approved paid ones, without explicit case-by-case decision:

1. Customer or contact personal data — names, emails, phone numbers, addresses (when we have any).
2. Special-category data — health, ethnicity, religion, sexual orientation, biometric, genetic.
3. Confidential third-party documents — counterparty contracts, NDAs, settlement agreements, materials shared under confidentiality.
4. Source code from systems we don't own / aren't licensed for that purpose.
5. Non-public financial data.
6. Authentication secrets — passwords, API keys, SSH keys, tokens, connection strings.
7. Internal documents we classify as Confidential.
8. HR records.
9. Anything received from a client under a duty of confidence.

## 6. Output handling

1. AI-generated content used in any work product must be reviewed by a human before publication / sending / acting on it.
2. Every cited claim verified against at least one independent source — for high-stakes claims, two.
3. AI-generated imagery used in customer-facing materials curated for accuracy, representation, rights.
4. No regulated-domain decision is made solely on the basis of AI output.

## 7. Logging

All significant AI-assisted work logged in git commits (for code and content), or in the relevant `.audit/` file (for governance work). "Significant" = affects another person, represents the business, touches sensitive data, is irreversible / expensive.

Currently: every commit IS an AI-use log entry, since virtually every commit is AI-assisted to some degree.

## 8. Settings and configuration

1. `Do not train on conversations` enabled on every account.
2. Default retention left at vendor default unless contract requires otherwise.
3. MFA enabled on every account.

## 9. Vendor changes

If an approved tool changes its terms, sub-processors, retention, or model behaviour in a way that materially affects how data is treated, the change is reviewed at the next quarterly cycle (or sooner if material). Documented in `../privacy/sub-processors.md`.

## 10. Incidents

If a leak / scam / hallucination causes or could cause harm: see `../privacy/breach-response-plan.md` and `../security/incident-log.md`. The first ten minutes matter. Do not delete evidence.

## 11. Training

The founder has read every module of the AI Safe@Work course. Logged in `ai-training-register.md`. Any future joiner must complete training within 30 days of start.

## 12. Roles and responsibilities

- **Every member of staff (today: founder)** — comply with this policy; report concerns promptly.
- **Owner** — review this policy quarterly; sign updates; act on incidents.

## 13. Consequences

Breach of this policy may result in disciplinary action up to and including termination. Where breach causes a personal-data breach under GDPR or a serious AI incident under EU AI Act Art 73, mandatory notification and remediation procedures apply.

## 14. Standards referenced

- Regulation (EU) 2024/1689 — EU AI Act, Arts 4 and 26.
- Regulation (EU) 2016/679 — GDPR, Arts 5, 6, 9, 32–34.
- ISO/IEC 42001:2023 — Cl 5.2, 7.2, 7.3, Annex A.2.
- ISO/IEC 27001:2022 — Annex A.5.10, A.5.13, A.5.23, A.6.3.

## Sign-off

| Role | Name | Date |
|---|---|---|
| Owner | Founder | 2026-05-19 |
| Effective from | | 2026-05-19 |
| Next review | | 2026-08-19 |
