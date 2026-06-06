# AI Safe@Work — Commercial Scope (Paid Tiers)

> **Status:** DRAFT · 2026-06-06
> **Tightly linked to:** [`DOCTRINE.md`](./DOCTRINE.md). SCOPE and DOCTRINE are
> co-authoritative. Any tier, deliverable or price change here requires a
> matching review of DOCTRINE — and any doctrine shift (north star, pillars,
> out-of-scope rules) requires a matching pass over SCOPE.
> Read both before quoting, scoping, or signing.

---

## Why this file exists

Stops scope creep. Every prospect ask, partner request, or "could we also do
X for them?" lands against this list first. If it is not in a tier below
**or** explicitly mapped into DOCTRINE, it is **out of scope** and must be
flagged, not silently absorbed.

## Doctrine anchors — do not break these

These doctrine rules govern all five tiers below. Tiers must conform; they
do not override doctrine.

| Doctrine rule | SCOPE consequence |
|---|---|
| Free core stays free at point of use (`DOCTRINE.md` § North star, § Product principles — what we do not do) | Tier 1 may bundle the training as an enablement layer but cannot paywall the 12 core modules |
| **We do not certify against ISO 42001 / 27001** (§ Standards hierarchy → "Out of scope to certify against") | Tier 4 is **Readiness only**. Must not be sold, named, or quoted as "certification". Certification work routes to accredited bodies (PECB / BSI / IRCA) |
| Two-entity split — SaaS vs Consultancy (§ Commercial structure) | Tiers 1–5 sit on the **Consultancy** side (Pillar 2 packs + Pillar 3 advisory). Pricing + delivery must be documented so the split survives entity creation |
| MSP channel pricing is separate (§ MSP commercial model — Tier 1/2/3 at £499 / £1,499 / £3k–£5k+/mo) | The tiers in this file are **direct-customer / consultancy** pricing. Not MSP platform tiers. Do not conflate in proposals |
| No vendor lock-in language, no LMS-locked delivery for free core | Tier-1 governance pack ships as portable artefacts (HTML / PDF / DOCX), not behind a paid LMS |
| Quarterly versioned changelog (§ Cadence) | Every tier deliverable carries the same versioning cadence; "policy maintenance" in Tier 5 means *applied to the customer's instance*, not the master templates |
| Sales partners only under named agreement (§ Sales partners) | Any tier sold by RORtech (or future partner) follows the partner-onboarding checklist; no off-doctrine bundling |

## Scope-creep gate (mandatory before quoting)

Before any tier is quoted, proposed, or amended, walk this five-step check.
If any step fails, stop and surface — do not bundle silently.

1. **Tier match.** Is the ask exactly one of Tiers 1–5? If "yes plus extras",
   the extras are out of scope until added here.
2. **Doctrine match.** Cross-check § North star, § Product principles, §
   Standards hierarchy "Out of scope to certify against", § Distribution
   doctrine. Any conflict = stop.
3. **Free-core protection.** Does the ask require paywalling, gating, or
   removing any of the 12 free core modules? If yes = refuse.
4. **Certification language.** Does the ask use the word "certification"
   against ISO 42001 / 27001? If yes = re-quote as "Readiness" (Tier 4
   only) and flag to buyer in writing.
5. **Partner / channel.** If sold via partner, is there a signed reseller
   agreement on file (`.audit/legal/partners/<partner>-agreement.pdf`)?
   If no = direct only.

Log every scope-creep flag in `.audit/commercial/scope-creep-log.md`
(create on first flag) with: date · buyer · ask · which gate failed ·
resolution.

---

These were the tiers I sent to you earlier Ali, let me know your thoughts gents:

### Tier 1 – AI Governance Foundation

Includes:

•⁠  ⁠AI Safe@Work Training
•⁠  ⁠Certificates
•⁠  ⁠AI Acceptable Use Policy
•⁠  ⁠AI Tool Register
•⁠  ⁠AI Risk Register
•⁠  ⁠AI Incident Response Procedure
•⁠  ⁠AI Governance Charter
•⁠  ⁠AI RACI Matrix
•⁠  ⁠AI Vendor Due Diligence Questionnaire
•⁠  ⁠AI Use Case Register
•⁠  ⁠AI Training Register
•⁠  ⁠AI Governance Scorecard
•⁠  ⁠Executive Management Briefing Pack

Target Price:
£4,995

> **Doctrine refs:** § Commercial pillars → Pillar 2 (Governance Packs);
> § Governance pack strategy; § Procurement-readiness gates → Gate 7
> (Templates pack — DPIA / FRIA / AUP / incident form / training register
> / vendor questionnaire — DONE 2026-06-03). Cert artefact = Gate 3
> (`cert.html`).
> **Watch:** "AI Safe@Work Training" inside this bundle is the
> *enablement wrapper* (rollout guide + cert + training register), not a
> paid replacement of the 12 free core modules. Free-core gate (scope
> step 3) applies.

---

### Tier 2 – AI Governance Assessment

Includes:

•⁠  ⁠AI Maturity Assessment
•⁠  ⁠Shadow AI Discovery
•⁠  ⁠Executive Workshop
•⁠  ⁠Executive Report
•⁠  ⁠Governance Roadmap

Target Price:
£7,500 - £9,995

> **Doctrine refs:** § Commercial pillars → Pillar 3 (Advisory +
> Consulting); § Audience hierarchy → P1 (Managers / approvers) + P2
> (Board / directors). Shadow AI Discovery aligns to the Shadow AI role
> track (`module-shadow-ai.html`, Procurement-readiness Gate 6).
> **Watch:** Assessment outputs are advisory artefacts — do not
> rebrand as "audit" or "certification".

---

### Tier 3 – AI Governance Readiness Programme

Includes:

•⁠  ⁠Governance Framework
•⁠  ⁠Governance Operating Model
•⁠  ⁠AI Approval Process
•⁠  ⁠AI Risk Management Framework
•⁠  ⁠Supplier Governance Process
•⁠  ⁠Board Reporting Pack
•⁠  ⁠Implementation Roadmap

Target Price:
£12,500 - £20,000

> **Doctrine refs:** § Commercial structure — Consultancy entity;
> § Commercial pillars → Pillar 3; § Audience hierarchy → P1 (DPO /
> compliance owners) + P2 (Board / directors). Supplier Governance
> Process maps to `module-procurement.html` + Gate 7 vendor
> questionnaire template.
> **Watch:** Standards cited (EU AI Act, ISO 42001, ISO 27001) must
> follow § Standards hierarchy — primary sources only; no marketing
> summaries.

---

### Tier 4 – ISO 42001 Readiness

Includes:

•⁠  ⁠Gap Analysis
•⁠  ⁠Clause Mapping
•⁠  ⁠Control Assessment
•⁠  ⁠Remediation Plan
•⁠  ⁠Internal Audit Preparation
•⁠  ⁠Certification Readiness

Target Price:
£15,000 - £30,000+

> **Doctrine refs:** § Standards hierarchy → ISO/IEC 42001:2023 cite-by-
> default; § Standards hierarchy → "Out of scope to certify against";
> Procurement-readiness Gate 1 (`standards-map.html`).
> **Hard guardrail:** "Certification Readiness" in the deliverables
> list means *preparing the customer to be assessed by an accredited
> body*. We do **not** issue certification, audit against the standard,
> or imply equivalence with PECB / BSI / IRCA. Quotes, contracts and
> collateral must say "ISO 42001 **Readiness**" — never "ISO 42001
> Certification". Re-quote any buyer who asks for the latter.

---

### Tier 5 – Fractional AI Governance Advisor

Includes:

•⁠  ⁠Monthly Governance Board
•⁠  ⁠AI Risk Reviews
•⁠  ⁠Policy Maintenance
•⁠  ⁠Supplier Reviews
•⁠  ⁠Incident Oversight
•⁠  ⁠Executive Reporting

Target Price:
£1,500 - £5,000 per month

> **Doctrine refs:** § Commercial pillars → Pillar 3 (Advisory retainer);
> § MSP commercial model (revenue-share row "Advisory retainers — 20–30%
> MSP referral fee" applies when partner-originated).
> **Watch:** "Policy Maintenance" = maintenance of the *customer's*
> deployed instance only. Master template maintenance follows the
> quarterly cadence (§ Cadence) and is **not** a per-customer
> deliverable. Incident Oversight aligns to the AI Incident Response
> Procedure (Tier 1) and to § Audit-readiness incident log.

---

## Out of scope — explicit "no" list

Surface these the moment a buyer asks. Do not absorb into a tier.

- ISO 42001 / 27001 **certification** (route to accredited body)
- Bespoke LLM build, fine-tuning, or MLOps engineering
- Live AI / deepfake / phishing simulations against the customer's real users (doctrine: ethics + risk)
- Penetration testing or red-team engagements
- White-labelling the 12 free core modules behind a customer paywall (free-core protection)
- Reselling without a signed reseller agreement on file
- US state-law overlays (NYC LL144, Utah, Colorado SB169) until P3 / P4 audiences are unlocked in § Audience hierarchy
- Sector overlays beyond Finance / Healthcare / Public Sector unless sold as a Tier 3+ engagement with explicit scope addendum

---

## About AI Safe@Work

Safe AI Adoption. Practical AI Governance.

AI Safe@Work was created to help organisations adopt Artificial Intelligence safely, responsibly and with confidence.

While AI presents significant opportunities to improve productivity, innovation and customer experience, many organisations are adopting AI faster than their governance, security and compliance controls can keep pace.

The result is growing concern around:

- Shadow AI
- Data protection and privacy
- AI-assisted fraud and social engineering
- Intellectual property protection
- Regulatory compliance
- Accountability and auditability
- Operational and reputational risk

We believe organisations should not have to choose between innovation and governance.
They should be able to achieve both.

### Built On Real-World Experience

AI Safe@Work has been developed by practitioners with more than 30 years of combined experience delivering technology, governance, cyber security and operational transformation across commercial, regulated and defence-sector environments.

Our experience spans:

- IT Leadership
- IT Service Management
- Information Security
- Governance, Risk & Compliance
- Cyber Security
- Defence & Secure Environments
- Digital Transformation
- Managed Service Providers
- Operational Governance

Our team has led and delivered programmes involving:

- ISO/IEC 42001 Artificial Intelligence Management Systems
- ISO/IEC 27001 Information Security Management Systems
- Cyber Essentials & Cyber Essentials Plus
- Defence Cyber Certification (DCC)
- Defence Standards Compliance
- NCSC Cyber Security Guidance
- Cyber Security Model (CSM) Version 3 & Version 4 Compliance
- ITIL Service Management
- Security Assurance & Compliance
- Governance Framework Development
- Risk Management & Audit Readiness
- Service Governance & Operational Maturity
- Infrastructure & Cloud Transformation
- Technology Strategy & Leadership

This experience has been gained through hands-on delivery within organisations ranging from SMEs through to highly regulated and defence-sector environments where governance, assurance, accountability and operational resilience are business-critical.

Our work has included supporting organisations operating within defence supply chains, delivering security and governance improvements aligned to customer, regulatory and contractual requirements, while balancing operational effectiveness with risk management and compliance obligations.

---

## Change control

| Date | Change | Author | Doctrine impact |
|---|---|---|---|
| 2026-06-06 | Initial SCOPE.md — 5 tiers as proposed to Ali; doctrine anchors + scope-creep gate added | A. Reid | None — tiers conform to existing pillars / packs / advisory structure |
| 2026-06-06 | Added "About AI Safe@Work" credibility section (positioning, experience, programmes delivered) | A. Reid | None — descriptive context only; no tier / price / deliverable changes |

Append-only. Every edit must list the doctrine sections re-checked and the
result of that re-check.
