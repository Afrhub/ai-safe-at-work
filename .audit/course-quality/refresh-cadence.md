# Standards refresh cadence

> **Owner:** Founder · **Effective:** 2026-05-19 · **Review:** annual

## Cadence

| Frequency | Action | Trigger | Output |
|---|---|---|---|
| Weekly | Link-rot + broken-anchor sweep | Auto on Friday | Fix or note in next changelog entry |
| Monthly | Readability + Lighthouse + WCAG smoke | First Monday | Issues filed; affects version PATCH |
| Quarterly | Standards refresh — walk every cite vs primary source; check ICO/CNIL/EDPB/AI Office/ENISA/NIST + relevant case law for movement; update citations-bibliography.md; cut MINOR release | Calendar reminder set for first week of: Feb, May, Aug, Nov | New version bumped, changelog entry, all flag-confidence items resolved, social post |
| Yearly | Full content audit; sector-overlay refresh; accreditation re-validation; partner check-ins | February | MAJOR review note, doctrine re-assessment |

## Subscribed mailing lists

| Source | URL | Why | Subscribed since |
|---|---|---|---|
| ICO updates (UK) | <https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/subscribe-to-our-mailing-list/> | UK GDPR + ICO guidance | TODO |
| CNIL actualités (FR) | <https://www.cnil.fr/fr/abonnez-vous-aux-publications-de-la-cnil> | French DPA position, EDPB co-chair | TODO |
| EDPB news | <https://www.edpb.europa.eu/news/news_en> (RSS) | Pan-EU guidance, binding decisions | TODO |
| European AI Office news | <https://digital-strategy.ec.europa.eu/en/policies/ai-office> | EU AI Act phases, implementing acts | TODO |
| ENISA publications | <https://www.enisa.europa.eu/news> (RSS) | EU agency for cybersecurity, AI guidance | TODO |
| NIST AI updates | <https://www.nist.gov/itl/ai-risk-management-framework> + AIRC mailing list | NIST AI RMF updates, GAI profile changes | TODO |
| ISO/IEC JTC 1/SC 42 updates | <https://www.iso.org/committee/6794475.html> | New AI standards, 42001 amendments | TODO |
| OWASP GenAI Security Project | <https://genai.owasp.org/> + mailing list | LLM Top 10 versioning | TODO |
| CSA AI updates | <https://cloudsecurityalliance.org/research/working-groups/ai-controls/> | AICM revisions, CAIQ-AI | TODO |
| Court reporters — EU and major member states | various (curated via Jus Mundi alerts or Hudoc for ECHR) | Case law on AI + GDPR | TODO |

Subscription is the founder's task **for this week**. Without these, the cadence loses its trigger.

## Quarterly review checklist

Run through this every quarter. Each ✓ is a precondition to cutting the MINOR release.

- [ ] Read all `ico.org.uk` updates since last review for anything tagged `AI`, `automated decision`, `accountability`.
- [ ] Read all `cnil.fr` updates since last review for `IA`, `intelligence artificielle`, `RGPD`.
- [ ] Read all EDPB binding decisions and opinions issued since last review.
- [ ] Read European AI Office updates and implementing-act drafts since last review.
- [ ] Read NIST AI updates + ENISA new publications.
- [ ] Read OWASP GenAI / CSA AICM revisions.
- [ ] Read ISO/IEC SC 42 updates.
- [ ] Spot-check 10 random citations from `citations-bibliography.md` — verify URLs still resolve and target text still matches our claim.
- [ ] Resolve every `flag`-confidence citation; move to `verified` or remove.
- [ ] Cross-reference with sector-specific updates: DORA (EBA, ESMA, EIOPA), HHS OCR (HIPAA), FDA (SaMD), OMB (federal AI), NYDFS, NAIC, SRA/Bar etc — at least scan headlines.
- [ ] Update `changelog.md` with everything changed.
- [ ] Bump version in every page footer (`v2026.05` → `v2026.08` etc).
- [ ] Bump version in JSON-LD `dateModified`.
- [ ] Update doctrine "Decision log" if posture changed.
- [ ] Publish — push to canonical domain.
- [ ] One-line summary post on relevant channels.

## Skip / delay protocol

If the founder cannot complete the quarterly review on time, the next review is **prioritised over new content**. We do not ship new modules on top of stale citations. Two consecutive skipped reviews triggers a doctrine emergency entry and a public banner: "Last reviewed: YYYY-MM-DD — pending refresh."
