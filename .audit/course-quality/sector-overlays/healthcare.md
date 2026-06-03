# Sector overlay outline — Healthcare

> Scope-locking outline. Full content authored at Phase 2+ build slot.

## Target audience

UK + EU healthcare SMB / mid-market organisations: GP practices, dental practices, specialist clinics, allied-health (physio / osteo / chiropractic), telehealth providers, private-hospital admin, care homes, NHS-trust admin staff, NHS GP federation IT staff. Plus the MSPs serving them.

## Why a sector overlay

Healthcare data is special-category data under GDPR Article 9 by default. Add to that:

1. **EU MDR + AI Act overlap**: many AI products in healthcare are also medical devices. Two regulators care; two regulators argue.
2. **NHS DSP Toolkit + DCB0129 + DCB0160** in the UK — distinct compliance regimes that intersect with AI.
3. **HIPAA** for any practice working with US patient data (telehealth crosses borders fast).
4. **Patient safety reporting** has a faster + sharper notification clock than GDPR for any AI failure that affected clinical care.

## Standards layered on top of universal course

- GDPR Article 9 + special-category recitals + national derogations
- EU MDR (Medical Device Regulation 2017/745) + AI Act overlap for SaMD
- FDA SaMD framework (cross-reference for US-touching practices)
- MHRA AI as a Medical Device programme (UK)
- NHS DSP Toolkit (UK)
- DCB0129 / DCB0160 (UK clinical-safety standards for digital health systems)
- HIPAA Security + Privacy + Breach Notification Rules (US cross-reference)
- ISO/IEC 81001-5-1 (security in health software)
- IEC 62304 (medical-device software lifecycle, cross-reference where relevant)

## Draft module list (overlay)

1. The healthcare governance layer — how GDPR Art 9 + EU MDR + EU AI Act + UK DCB0129 combine
2. The healthcare never-paste list — patient identifiers, clinical-record extracts, prescription data, diagnostic images
3. AI as a Medical Device — when an AI tool crosses the MDR/SaMD threshold
4. Clinical-safety case files for AI-enabled tools — DCB0129 + DCB0160 in practice
5. Triage chatbots, AI receptionist tools — Consumer-facing healthcare AI risks
6. Cross-border patient data — UK / EU / US flows
7. Patient-safety reporting — Yellow Card / MHRA / EU MDR Article 87 + AI Act Article 73 interaction
8. Incident escalation — which regulator hears about an AI incident, in what order
9. Final assessment

## Target audience size (provisional)

- UK + EU healthcare SMBs: ~200,000 orgs.
- Staff in patient-facing or admin-facing roles handling clinical data: ~1.8M.
- Reachable through MSPs serving healthcare + ICO / CNIL / health regulator lists + RCGP / BMA / specialist association channels.

## Sales motion

- Premium Governance Pack (Pillar 2) at £999–£1,999 per organisation per year.
- Optional MSP-resold add-on at the 50/50 rev share.
- Advisory attach (Pillar 3) for clinical-safety case-file work — typically higher day rate due to required clinical-safety officer credentials.

## Status

- 2026-06-02 — outline locked.
- 2026-06-03 — **SHIPPED** as `/sector-healthcare.html`. 9 sub-modules + 10-question assessment per outline. JSON-LD `LearningResource` + `BreadcrumbList`. Blue accent (sector overlay differentiator). 515-line single-page HTML. Wired into `course.html` (Sector overlays section, now 2 cards), `llms.txt` (2nd Sector entry + lede bump to "2 sector overlays"), `sitemap.xml`. Second of three planned overlays; advances DOCTRINE.md gate 10 from 1/3 → 2/3.
