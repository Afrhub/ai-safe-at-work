# Sector overlay outline — Financial Services

> Scope-locking outline. Full content authored at Phase 2+ build slot.

## Target audience

EU + UK financial-services SMBs and mid-market firms: independent advisers, brokers, asset managers ≤ £500M AUM, fintech ≤ 50 staff, payment processors, BNPL operators, insurance brokers, accountancy + audit firms with regulated work. Plus the MSPs serving them.

## Why a sector overlay

Financial services has three properties that warrant a separate overlay:

1. **Article 13 of DORA** (Digital Operational Resilience Act, in force January 2025) makes ICT third-party risk a board-reportable matter — AI vendors are ICT third parties.
2. **Sector regulators (FCA, PRA, BaFin, AMF, CNMV)** issued AI-specific guidance in 2024–2025 that lands on top of the EU AI Act. Staff need to know which lever the regulator pulls.
3. **The never-paste list expands** to include customer PII tied to financial product, MNPI (material non-public information), trading positions, internal credit-risk models, AML / KYC investigation records.

## Standards layered on top of universal course

- DORA (Digital Operational Resilience Act) — Articles 5, 6, 8, 13, 28, 29
- NIS2 — Article 21 (overlaps with DORA for some firms)
- FCA Consumer Duty (UK) — Principle 12
- FCA / PRA SS1/23 — operational resilience
- SR 11-7 (Fed) — model risk management
- EBA Guidelines on Outsourcing Arrangements
- MAS FEAT (Singapore) — Fairness, Ethics, Accountability, Transparency
- NYDFS Part 500 — cybersecurity for financial services in NY
- MiFID II Article 17 — algorithmic trading governance (where in scope)
- NAIC Model Bulletin on AI use in insurance (cross-reference)

## Draft module list (overlay = supplements universal course)

1. The financial-services governance layer — how DORA + EU AI Act + sector guidance combine
2. The financial-services never-paste list — what additional categories go on top of the universal list
3. SR 11-7 model risk management for AI models
4. DORA Article 13 — AI as ICT third-party risk
5. AML / KYC investigation records and AI — what cannot leave the case file
6. Algorithmic trading + EU AI Act + MiFID II
7. Customer-facing AI (chatbots, financial advice nudges) — Consumer Duty implications
8. Incident escalation — which regulator hears about an AI incident, in what order
9. Final assessment

## Target audience size (provisional)

- UK + EU financial-services SMBs subject to DORA: ~80,000 firms.
- Staff in those firms: ~600,000.
- Reachable through MSPs serving financial services + IAPP financial-services chapters + FCA / regulator outreach lists.

## Sales motion

- Premium Governance Pack (Pillar 2) at £999–£1,999 per organisation per year.
- Optional MSP-resold add-on at the 50/50 rev share.
- High day-rate advisory attach (Pillar 3) for actual SR 11-7 / DORA implementation work.

## Status

- 2026-06-02 — outline locked.
- 2026-06-03 — **FIRST-PASS SHIPPED** as `/sector-financial-services.html`. Single-page HTML, 9 sub-modules + 10-question assessment, JSON-LD `LearningResource` + `BreadcrumbList`. Blue accent (`var(--blue)`) to differentiate sector overlay visually from amber role tracks. Wired into `course.html` (new "Sector overlays" section), `llms.txt` (new "Sector overlays" section), `sitemap.xml`. First of three planned overlays; advances DOCTRINE.md gate 10 from TODO → 1/3.
