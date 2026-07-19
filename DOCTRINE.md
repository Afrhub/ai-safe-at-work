# AI Safe@Work — Project Doctrine

> **Status:** LOCKED · 2026-05-19 · source-of-truth
> Every content, feature, partnership and pricing decision must move us
> toward closing one of the procurement gaps below or reinforce the wedge.
> If it doesn't, drop it or defer it.
>
> Canonical version: this file (`~/.openclaw/workspace/ai-safe-at-work/DOCTRINE.md`).
> Obsidian mirror: `second-brain/Projects/ai-safe-at-work/doctrine.md` — keep in sync.
>
> **Tightly linked to:** [`SCOPE.md`](./SCOPE.md) — the paid-tier commercial
> scope (Tiers 1–5). DOCTRINE and SCOPE are co-authoritative for any
> commercial conversation. Before quoting, scoping, or signing: read both.
> Any tier or price change in SCOPE requires a doctrine re-check; any
> doctrine shift (north star, pillars, out-of-scope rules) requires a
> matching pass over SCOPE. Scope-creep gate lives in SCOPE.md and is
> mandatory before any quote.

---

## North star

**Own the non-technical SMB staff layer of AI-safety education in the EU.**

Plain English. Standards-cited. EU AI Act Article 4 literacy by default.
Free at point of use, audit-grade by design.

Every other audience (board, devs, sector specialists, US buyers) is
secondary funnel. Sector and role overlays are how we scale; the SMB-staff
wedge is what we defend.

---

## Position — the wedge

| Property | We are | They are |
|---|---|---|
| Audience | Non-technical SMB staff | Governance pros (IAPP), auditors (ISACA), sec engineers (SANS) |
| Tone | Plain English, fragments of story | Either standards-only or oversimplified |
| Standards posture | Cited inline, mapped explicitly to clauses | Implied or marketed |
| Format | Standalone static HTML, no login, SCORM-ready | LMS-locked, paid cert flow, vendor lock-in |
| Language | EN first, FR next, then DE / ES / IT / NL | EN-dominant |
| Cadence | Quarterly rule-tracking refresh | Annual cert refresh |
| Price | Free core, paid overlays / templates / SCORM | Premium pricing $700–$8k |
| Wedge defensibility | Free × non-tech × EU-Act-mapped × plain English | Each owns one or two axes, none owns all |

Direct competitor on this wedge: **none mature** as of 2026-05.

---

## Audience hierarchy

| Priority | Audience | What they get | Status |
|---|---|---|---|
| P0 | Non-technical SMB staff (universal) | 12 modules + checklist + standards map | shipped v1 |
| P1 | Managers / approvers of AI-assisted work | Manager track w/ review duties, log-keeping | TODO |
| P1 | DPO / compliance owners | DPIA + FRIA + AUP templates pack | TODO |
| P2 | Developers / IT integrating LLMs | OWASP LLM Top 10, MITRE ATLAS, supply chain | TODO |
| P2 | Board / directors | ISO 38507, AI in annual report, fiduciary | TODO |
| P3 | Sector overlays (finance, healthcare, public-sector, education) | Sector modules + sector-specific never-paste lists | TODO |
| P4 | US buyers | NIST AI RMF + state-law overlays (NYC LL144, Utah, Colorado SB169) | TODO |

P3 and P4 only after P1 + P2 monetisation proven.

---

## Standards hierarchy

> [!info] Cite-by-default
> EU AI Act 2024/1689 (Art 4, 14, 22 placeholder, 26, 27, 50, 73)
> GDPR (Arts 5, 6, 9, 22, 28, 32–34, 39, 44–50)
> ISO/IEC 42001:2023 (Clauses 6–9, Annex A.3, A.4, A.5, A.6, A.7, A.9, A.10)
> ISO/IEC 27001:2022 (A.5.10, A.5.13, A.5.23, A.5.34, A.6.3, A.8.5, A.8.12, A.8.15, A.5.24–26)

> [!info] Cite where natural
> NIST AI RMF 1.0 + GAI Profile (NIST AI 600-1)
> OWASP Top 10 for LLM Applications
> MITRE ATLAS
> ISO/IEC 23894 (AI risk)
> ISO/IEC 38507 (board / IT governance of AI)
> ENISA Multilayer Framework for AI Cybersecurity
> CSA AI Controls Matrix (AICM) + CAIQ-AI

> [!info] Sector overlays — load on demand
> Finance: DORA Art 13, NYDFS Part 500, SR 11-7, EBA, MAS FEAT, MiFID II
> Healthcare: HIPAA, FDA SaMD, EU MDR + AI Act overlap, MHRA
> Public sector: OMB M-24-10 / M-25-21, UK AI Playbook, AI Act Annex III, FedRAMP, CJIS
> Critical infra: NIS2 Art 21, NERC CIP-004
> Insurance: NAIC Model Bulletin, Colorado SB21-169, EIOPA
> Education: US Dept of Ed + UK DfE guidance, COPPA, FERPA
> Children: UK AADC, California SB 1001, Utah AI Policy Act
> Automotive: ISO/SAE 21434, UNECE R155/R156, ISO/PAS 8800
> Aviation: EASA AI Roadmap, FAA AI
> Defence: US DoD RAI, NATO AI Strategy, UK MOD AI Defence Strategy
> Telecom: UK PSTI, ETSI TS 104 223, FCC AI robocall
> Legal: SRA/Bar warnings, ABA Resolution 604
> Energy: EU EED, FERC

> [!warning] Out of scope to certify against
> We do not certify against ISO 42001 / 27001. We help staff *meet* the
> training-and-literacy obligations within those standards. Certification
> remains PECB / BSI / IRCA / accredited-body territory.

---

## Product principles — what we do

1. **One module = 5–10 minutes, one idea, two things to do.** No filler.
2. **Standards land in a callout, not the prose.** Plain English first; the standard cite is the receipt.
3. **Real incidents, not invented hypotheticals.** Mata v. Avianca, Arup deepfake, Samsung code paste — named, dated.
4. **Three-bucket framing repeats throughout.** Data-in, output-out, attack-against. Everything maps to one of three.
5. **"Sentinel" — light-first enterprise-security language (Palo Alto idiom). Light mode is THE DEFAULT** (no `data-theme` attribute); dark is opt-in only. White canvas, charcoal hero/feature bands, generous whitespace, big bold tightly-tracked headings, soft rounded cards (12px) with a gentle hover lift. **Accent: orange #fa582d, rationed** to CTAs, eyebrow dashes, links, list markers and interactive states — never as wallpaper, never on body text. Heading emphasis (`em`) may take the accent. Body text is grey on white. **Signals keep meaning**: green = practice/pass, red = caution/prohibited, blue = sector overlays. Banner line-art is CSS-inverted to ink-on-paper. **Light is the default; dark is opt-in** via `html[data-theme="dark"]` (pill toggle, persisted to `aisw-theme`). The old "Audit Dossier" chrome — crop-marks, § clause numbers, REF chips, blueprint/watermark parallax — is retired. (Rebrand 2026-06-30, founder brief: match paloaltonetworks.com tone; replaced the periwinkle-on-carbon dossier. Typography: Atkinson Hyperlegible Next / Mono site-wide for low-vision legibility — body ≥17px.)
6. **Print survives.** Module 11 must print clean. Future printables (manager guide, AUP template) same rule.
7. **Cite primary sources only.** Regulator pages, official ISO clause numbers, court rulings — no marketing summaries.
8. **Plain text + JSON-LD over framework lock-in.** Static HTML, no React, no Next, no Tailwind. Static deploys to anything.
9. **Quarterly review with dated changelog.** Standards move; we move with them or we lie.
10. **Audit-evidence shape always.** Every learner action that could matter to an auditor (completion, knowledge check, role, date) is exportable.

---

## Product principles — what we do not do

| No | Reason |
|---|---|
| No payment wall on the 12 core modules | Wedge depends on free core |
| No login on the core modules | Friction defeats the audience |
| No vendor lock-in language ("powered by ChatGPT" etc) | Procurement red line |
| No "AI made this content" without human edit | Hypocritical given Module 5 |
| No certification claims we can't back | Career-damaging if misrepresented |
| No US-only content as default | We are EU-first |
| No emoji decoration in the UI | Brand discipline |
| No React / Vue / Tailwind / build toolchain | Static + maintainable forever |
| No "AI safety" content that's actually AI ethics (alignment, x-risk) | Different audience, different field |
| No deepfake or phishing simulations against real targets | Ethics + risk |
| No live AI calls from the site | Static; no data egress; no leaks |
| No tracking analytics on the static course | Privacy promise on `privacy.html` |

---

## Procurement-readiness gates

Hard gates blocking enterprise / public-sector adoption. None optional.
Until closed, we cannot win a tender or be added to a corporate LMS.

| # | Gap | Why it blocks procurement | Effort | Status |
|---|---|---|---|---|
| 1 | **Standards Map annex** — clause-to-module table (EU AI Act Art 4, ISO 42001 7.2 / A.4.5, ISO 27001 A.6.3) | First doc procurement asks for | 2 hr | **DONE 2026-05-19** — `standards-map.html` (v1.1) public; EU AI Act Art 4 + ISO 42001 + ISO 27001 + GDPR + NIST AI RMF clause-to-module map. **v2 follow-up TODO**: render v2-aware standards-map under `/v2/standards-map.html` linking v2 module IDs. |
| 2 | **Knowledge checks per module** (5 MCQ, stored in localStorage, score-exportable) | Audit-grade evidence of comprehension | 1 day | **DONE 2026-05-27** — 10 MCQs per module M1-M12 (120 total), 5 options each (balanced 0-4), sourced from body, cited back, localStorage `aisw-quiz-mN` |
| 3 | **Completion certificate w/ unique ID + verifiable URL** | Audit trail | 1 day | **DONE 2026-05-27** (partial) — `cert.html` printable A4 landscape, ref ID `AISW-MNN-YYMMDD-XXXX`, reads localStorage. **Open**: central verification URL (deferred; would require backend; deterministic ID lets buyers reproduce verification by re-running the quiz). |
| 4 | **SCORM 1.2 + xAPI export wrapper** | LMS deployment (Moodle, Workday, Cornerstone, 365 Learn) | 1 week | **DONE 2026-06-03** (commit `310daf6`) — `v2/scorm/imsmanifest.xml` (ADL CAM v1.2, single-SCO, mastery 80, 2h cap) + `v2/scorm/metadata.xml` (IMS LRM en/fr/de) + `v2/assets/scorm-api.js` (API discovery parent×7 + opener, `cmi.*` writer, JSON `suspend_data`, `pagehide` LMSFinish) + `v2/assets/xapi-adapter.js` (HTTPS-gated POST, anonymous actor, no auth-in-URL, `credentials: 'omit'`) + `scripts/build-scorm.py` (stdlib zip, zip-slip safe, `--locale en\|fr\|de\|all`). Built `dist/ai-safe-at-work-scorm-v2-en.zip` = 61227 bytes. xAPI spec under `.audit/integrations/xapi-statements-spec.md`. Buyer guide: `v2/scorm/README.md` (Moodle, Cornerstone, Workday, SCORM Cloud). |
| 5 | **FR + DE translations** (EN done) | EU literacy obligation, member-state language | 2–4 wk per language | **SHELLS DONE 2026-06-03** (commit `310daf6`); **finishing step ready 2026-06-03 PM** — translator-vendor sourcing pack at `.audit/legal/translator-sourcing-2026-06-03.md` (scope statement, word-count breakdown ~37,300 target words, 4-tier vendor shortlist 15+ candidates with pricing bands £0.05-£0.30/word, paste-and-send RFQ template, acceptance criteria + sample-quality bar, budget guidance £3,400-£8,600 all-in, post-review integration plan). User action: send RFQ to 3-vendor shortlist (1 each Tier 1 / 2 / 3); 6-10 week timeline. (commit `310daf6`) — `v2/fr/` 13 files (`index`, `course`, `module-1`..`module-11`) + `v2/de/` 13 files. Every page banner: machine-translation pending native review + link back to canonical EN. `modules.json` extended w/ `i18n.supportedLocales` + per-module `locales.{fr,de}.{title,duration,summary}` + `ui.{en,fr,de}` UI dict. `v2.js` locale-aware: `manifestUrl()` resolves `../modules.json` from subdirs, `localiseModule()`, `getUi()`, `detectLocaleFromPath()`. Verified: 15/15 smoke URLs returned 200; FR M1 title "Pourquoi la gouvernance de l'IA compte"; DE M1 title "Warum KI-Governance wichtig ist". **Open**: native-speaker review pass before procurement deployment (shell ships now, native polish ships when translator budget approved). |
| 6 | **Relevant Roles** (role-based tracks: board, manager, IC, DPO, dev) | Different roles → different obligations | 2–3 wk | **DONE 6/6 2026-06-03** — Manager + DPO (v2026.05) + MSP / IT Admin + Microsoft Copilot + Shadow AI + **Governance &amp; Procurement shipped today**. `/module-procurement.html`: 10 sub-modules per outline covering why-AI-procurement-differs (six SaaS-template-breaking properties) + 37-Q vendor questionnaire as buying instrument + DPA 4-clause review (scope incl training, sub-processor with teeth, data return + deletion, Schrems II + TIA) + sub-processor disclosure depth-2 verification + foundation-model as sub-processor + Article 13 procurement evidence shopping list + Article 26 deployer-obligation procurement-shaping table + 10-row sector framework mapping (FS / Healthcare / Public Sector / Education / Energy across UK + EU + US) + contracting for change (model swap + term change + exit + IP/bias indemnification) + buy/build/compose/defer decision tree + TCO model + 10-question assessment. Original. 6 of 6 planned role tracks LIVE. `/module-shadow-ai.html` is a two-persona track (CISO/IT-lead + end-user staff) following the MSP/Copilot shell pattern: 10 sub-modules per outline at `.audit/course-quality/role-track-outlines/shadow-ai.md` covering what-Shadow-AI-is + four-shapes taxonomy (consumer chatbots / browser extensions / AI-in-SaaS / personal accounts) + discovery-without-panic toolkit + why-bans-fail + acceptable-use posture + procurement gating + end-user education scripts + Shadow-AI-flavoured incident response + 90-day containment plan + 10-question assessment. 482 lines, JSON-LD `LearningResource` + `BreadcrumbList`. Wired course.html / llms.txt / sitemap.xml. Remaining: Governance & Procurement, AI Governance Officer, Developer/Technical AI (outlines for first two exist). 5 of 6 planned tracks live. |
| 7 | **Templates pack** (DPIA, FRIA, AUP, incident form, training register, vendor questionnaire) | Procurement loves "in the box" | 2 wk | **DONE 2026-06-03** — all six shipped under `/templates/`. AUP + vendor questionnaire (v2026.05). Today: `training-register.html` (EU AI Act Art 4 audit-grade evidence record, 8-column schema), `dpia-template.html` (GDPR Art 35, full risk-matrix, Art 36 trigger), `incident-form.html` (GDPR Art 33/34 + AI Act Art 73 + NIS2 + DORA reporting-deadline reference, full timeline + RCA + lessons), `fria-template.html` (EU AI Act Art 27, 7 Charter rights, Art 14 oversight, Art 27(3) authority notification). Each: printable A4, JSON-LD `HowTo` + `BreadcrumbList`, canonical URL, standards-mapping section, sign-off block. Wired into `course.html` Templates section (now 6 cards) + sitemap.xml. |
| 8 | **WCAG 2.2 AA audit + fixes** | Public sector + DDA compliance | 1–2 wk | **FIRST-PASS DONE 2026-06-03** — static audit across all 74 HTML files (35 v1 + 39 v2). Three Level A / AA fails fixed: (1) skip-to-content link added on every page via idempotent `scripts/inject-skip-link.py` + CSS (.skip-link), (2) `:focus-visible` block added across `a / button / summary / input / select / textarea / [tabindex]` in both `assets/style.css` and `v2/assets/v2.css` with `--focus-ring` var, (3) `--text3` contrast fix in both stylesheets (v1: `#445566`→`#8595a7` 2.6:1→6.7:1; v2: `#5e7286`→`#8595a7` 4.1:1→6.7:1). Audit doc: `.audit/accessibility/wcag-audit-2026-06-03.md`. Eight items (D1–D8) deferred to next-quarter manual + AT pass scheduled 2026-09 (axe-core, pa11y CI, NVDA + VoiceOver sweep, touch-target verification, focus-not-obscured testing). Accessibility statement updated to v2026.06 reflecting changes. |
| 9 | **Quarterly versioned changelog + RSS** | "Updated content" signal | 1 wk | **DONE 2026-06-03** — `changelog.xml` (RSS 2.0, two items: v2026.05 + v2026.06) + `changelog.json` (JSON Feed v1.1, same items) + `changelog.html` v2026.06 release entry. Feed-discovery `<link rel="alternate">` in changelog `<head>`; visible "Subscribe: RSS · JSON Feed" line under lede. Feeds added to sitemap.xml. |
| 10 | **Sector overlays — finance, healthcare, public-sector first** | Each unlocks a vertical sales motion | 3–6 wk each | **DONE 3/3 2026-06-03** — Financial Services + Healthcare + **Public Sector overlays all shipped today**. Public Sector at `/sector-public-sector.html`: 9 sub-modules per outline covering Annex III high-risk public services + Article 27 FRIA mandatory pathway + UK AI Playbook + ATRS Tier 1/2 publication + UK GDPR public-task + Public Sector Bodies Accessibility Regs + EAA + FOI + EIR + Equality Act s.149 PSED + Article 86 right to explanation + G-Cloud / CCS / EU 2014/24/EU procurement + AI-specific contract clauses + judicial review + ombudsman (LGSCO, PHSO, devolved) + NAO + select-committee accountability venues + 12-category public-sector never-paste list. Original. `/sector-healthcare.html` 9 sub-modules per outline at `.audit/course-quality/sector-overlays/healthcare.md`: GDPR Article 9 + EU MDR + EU AI Act + DCB0129/0160 + NHS DSPT regulatory stack · 12-category healthcare never-paste list (NHS number, clinical-record extracts, prescription, diagnostic images, genetics, mental-health, safeguarding, sexual-health, etc.) with pseudonymisation-isn't-anonymisation warning · AI as Medical Device (MDR Rule 11 SaMD classification + intended-purpose test with 6 worked examples + MHRA AI-as-MD programme) · DCB0129 manufacturer + DCB0160 deployer clinical-safety case files + named clinical-safety officer requirement · triage chatbot / AI receptionist combined regulatory load (MDR + Annex III + GDPR + CQC + Equality Act) with procurement red-flag list · cross-border patient data 6-flow matrix (UK/EU/US adequacy + Data Bridge + DPF + HIPAA BAA) · 9-clock patient-safety reporting matrix (Yellow Card + MDR Art 87 + AI Act Art 73 + GDPR 33/34 + CQC + DSPT + NIS2 + HIPAA + StEIS/LFPSE) · multi-regulator incident escalation order · 10-question assessment. 515-line single-page HTML. Remaining: Public Sector overlay (outline exists). |
| 11 | **Manager / trainer rollout guide** | Internal adoption aid | 1 wk | **DONE 2026-06-03** — `/rollout-guide.html` dual-audience (internal manager + MSP partner): week-0 prep checklist, week-1 launch + sample kickoff message, week-2 completion drive, week-3 assessment + cert, week-4 embed + audit binder. Roles + responsibility matrix (7 roles, time-per-week). 7-KPI table (completion / pass-rate / AUP / register / incidents / time-to-escalate / refresh). 9-row common-pitfall table. Each week has an MSP-variant purple-callout (multi-customer cohorts, staggered kickoffs, per-customer registers, white-label posture). 8 artefact handover checklist at end. JSON-LD `HowTo` w/ 5 steps. Wired into `course.html` (callout pre-"How to use this course"), `msp.html` (CTA line under lede), `llms.txt` (new "Rollout" section + lede bump to "6 templates + 30-day rollout guide"), `sitemap.xml`. |
| 12 | **HTTPS + production domain** | Required for any serious deployment | <1 day | **PARTIAL 2026-06-03** — current canonical = Netlify subdomain `aisafework.netlify.app` (HTTPS live, HSTS preload pending). RDAP availability scan + purchase recipe + DNS recipe filed at `.audit/legal/domain-procurement-2026-06-03.md`. Purchase blocked on financial action (user). |
| 13 | **JSON-LD (`Course`, `LearningResource`, `FAQPage`, `BreadcrumbList`) + sitemap.xml + robots.txt + llms.txt** | Discoverability + AI-citation engines | 2 hr | **DONE 2026-06-03** for v1 (existing) + v2 (new). v2: 39 pages × 2 JSON-LD blocks (WebSite/Course/LearningResource + BreadcrumbList) via `scripts/inject-v2-seo.py` (idempotent splicer, marker `v2-seo:injected v1`). Sitemap + robots already shipped v1; v2 sitemap entries deferred until `noindex` lifted. |
| 14 | **OpenGraph + Twitter card meta per page** | Social / chat sharing | 1 hr | **DONE 2026-06-03** for v1 (existing) + v2 (new). v2: same splicer injected OG + Twitter card meta + locale alternates across 39 pages (EN/FR/DE). |
| 15 | **Accreditation partnership for CPD / CPE credit** (IAPP, ISACA, ISC2) | Cert maintenance buyers | multi-month, external | TODO |

Gates 1, 2, 3, 13, 14 are the **week-one block**. Gates 4–7 are the **quarter-one block**.

**Status as of 2026-06-03 (very end of day — major session)**: gates 1, 2, 3, 4, **6**, 7, 9, **10**, 11, 13, 14 closed; gate 5 shells shipped + sourcing pack ready (finishing step user-actionable); gate 8 first-pass DONE (manual + AT pass scheduled 2026-09); gate 12 PARTIAL (recipe ready, purchase blocked on user financial action). Only gate 15 (CPD accreditation — external multi-month) remains genuinely off-roadmap. Full content estate complete: 6 role tracks + 3 sector overlays + 6 templates + 30-day rollout guide + SCORM/xAPI export + EU-locale shells + first-pass WCAG conformance + DORA-era FS + GDPR-Art-9 healthcare + Annex-III public-sector. RORtech-equivalents can self-serve any vertical, persona, or framework conversation.

---

## Distribution doctrine

1. **Static site at canonical domain** — primary surface.
2. **Embeddable widget** so other sites can mount the modules (script tag, iframe-isolated). Builds backlinks; positions us as infrastructure.
3. **Repo-public** — open the source. Trust + free SEO + audit-friendliness.
4. **No paid marketing** on free core. Distribution earned via standards mapping, embeddability, and the rule-tracking changelog.
5. **Paid offerings** — SCORM pack, templates pack, sector overlays, manager guide, trainer accreditation, white-label.
6. **EU-first SEO** — pillar pages target EU-AI-Act + ISO-42001 + GDPR + DORA query space. US queries (NIST AI RMF, NYC LL144) are second-pass.
7. **Channel partners** — authorised resellers / referrers may sell paid tiers under named partner agreement. See § Sales partners.

---

## § Sales partners

> Authorised resellers / channel partners / referrers permitted to sell or resell paid tiers under named agreement. Free core remains free at point of use regardless of channel. Added 2026-05-19.

| Partner | Type | Status | Territory | Tiers permitted | Margin / commission | Agreement |
|---|---|---|---|---|---|---|
| **RORtech Partners Limited** | Authorised reseller (first) | Onboarding · contract pending | TBD (default: global) | TBD (default: all paid tiers) | TBD | reseller agreement TBD |

### Partner-onboarding requirements (every entry)

- Signed reseller / channel agreement on file (`.audit/legal/partners/<partner-name>-agreement.pdf`).
- Sub-processor disclosure if partner touches customer personal data (RoPA + sub-processor register updated).
- Branded white-label terms agreed if partner co-brands the course (default: NO white-label without explicit clause).
- Quarterly partner-revenue reconciliation logged in `.audit/legal/partner-revenue-YYYY-QN.md`.
- Partner does not modify course content without doctrine review.
- Partner does not represent the course as accredited until accreditation actually lands.

### Conflict + exclusivity policy

- No exclusivity granted by default. Multiple partners may operate in the same territory.
- Direct sales by AI Safe@Work remain available at all times.
- Conflicts (two partners chasing same buyer) resolved by first-registered-deal rule, recorded in a shared deal register.

### Termination

- Either party may terminate w/ 90 days written notice.
- Termination triggers: misrepresentation of accreditation status, breach of confidentiality, breach of brand guidelines, non-payment, failure to keep AUP applied to own staff handling course data.

---

## § Commercial scope — paid tiers (canonical pointer)

> Added 2026-06-06. **Authoritative source: [`SCOPE.md`](./SCOPE.md).**
> This section is a doctrine-side pointer + guardrail summary; it does not
> replicate the tier deliverables. Read SCOPE.md for the full list and
> mandatory scope-creep gate.

**Tier list (direct / consultancy pricing, separate from § MSP commercial model channel pricing):**

| Tier | Name | Target price | Doctrine home |
|---|---|---|---|
| 1 | AI Governance Foundation | £4,995 | § Commercial pillars → Pillar 2 (Governance Packs); § Governance pack strategy; Procurement-readiness Gate 7 (templates) + Gate 3 (cert) |
| 2 | AI Governance Assessment | £7,500 – £9,995 | § Commercial pillars → Pillar 3 (Advisory); § Audience hierarchy → P1 + P2 |
| 3 | AI Governance Readiness Programme | £12,500 – £20,000 | § Commercial structure → Consultancy entity; § Commercial pillars → Pillar 3 |
| 4 | ISO 42001 Readiness | £15,000 – £30,000+ | § Standards hierarchy → ISO/IEC 42001 cite + **"Out of scope to certify against"** hard guardrail |
| 5 | Fractional AI Governance Advisor | £1,500 – £5,000 / mo | § Commercial pillars → Pillar 3 (advisory retainer); § MSP commercial model (referral-fee row if partner-originated) |

**Doctrine guardrails that bite every tier — restate before any quote:**

1. Free-core protection — no tier may paywall the 12 core modules (§ North star · § Product principles — what we do not do).
2. Tier 4 is **Readiness, not Certification**. Doctrine § Standards hierarchy is explicit: we do not certify against ISO 42001 / 27001. Quotes, contracts, collateral must use "Readiness". Re-quote any buyer who asks for "Certification".
3. Two-entity split (§ Commercial structure) — Tiers 1–5 sit on the Consultancy side. MSP platform tiers (£499 / £1,499 / £3k–£5k+/mo) are separate and live in § MSP commercial model. Do not conflate.
4. Standards cited inside any tier deliverable must follow § Standards hierarchy (primary sources only) and § Audit-readiness evidence shape.
5. Partner-sold tiers route through § Sales partners onboarding requirements (signed agreement on file, sub-processor disclosure if applicable, no white-label without explicit clause).
6. Scope-creep gate in SCOPE.md is **mandatory** before any quote. Every flagged creep logged in `.audit/commercial/scope-creep-log.md`.

**When DOCTRINE moves, SCOPE re-checks. When SCOPE moves, DOCTRINE re-checks.** Append to SCOPE change-control table and (where it shifts doctrine) to § Decision log here.

---

## § Anti-scraping + AI-crawler controls

> Added 2026-05-19. Refined 2026-05-19. Strategy: **split AI crawlers into TRAINING-only vs CITATION / answer-engine UAs**. Block training-only site-wide. Allow citation engines on free core (they drive the trust-signal traffic that converts to paid). Block both on paid surfaces.

### The wedge — non-negotiable

- The free core is a **trust signal**. ChatGPT, Claude, Perplexity, Gemini citing our content with a link IS the acquisition channel. `llms.txt` is the format that feeds these engines and stays in place.
- The **paid surfaces** (SCORM exports, customer-account dashboards, audit-pack CSV exports, certificate verifications, bespoke content) must not be ingested by anyone — training crawler, citation crawler, scraper, competitor.
- Resolution: same-vendor split. OpenAI ships `GPTBot` (training, no return) and `ChatGPT-User` + `OAI-SearchBot` (citation, returns traffic). They are different UAs and we can treat them differently.

### Training-only crawlers — block SITE-WIDE

| UA | Vendor | What |
|---|---|---|
| `GPTBot` | OpenAI | Training corpus for next GPT |
| `ClaudeBot` · `anthropic-ai` | Anthropic | Training corpus for next Claude |
| `CCBot` | Common Crawl | Feedstock for every model trainer downstream — biggest leverage block |
| `Google-Extended` | Google | Opt-out signal for Gemini training (separate from Googlebot, which stays allowed) |
| `Bytespider` | ByteDance | TikTok / Doubao training |
| `Amazonbot` | Amazon | Mixed search/training; conservative = block |
| `Applebot-Extended` | Apple | Apple Intelligence training opt-out (separate from Applebot, which stays allowed) |
| `Meta-ExternalAgent` | Meta | Llama training |
| `cohere-ai` · `cohere-training-data-crawler` | Cohere | Training |
| `omgili` · `omgilibot` · `Webz.io` | Webz | Training-corpus reseller |
| `ImagesiftBot` · `YouBot` · `Diffbot` · `magpie-crawler` · `AI2Bot` · `Timpibot` · `PetalBot` | various | Training |

### Citation / answer-engine crawlers — ALLOW free core, block paid

| UA | Vendor | Why allow on free |
|---|---|---|
| `ChatGPT-User` | OpenAI | On-demand fetch when user pastes URL into ChatGPT or asks it to look something up. Drives citation w/ link. |
| `OAI-SearchBot` | OpenAI | ChatGPT Search index — cites with link. |
| `Claude-Web` | Anthropic | On-demand fetch from claude.ai. Cites w/ link. |
| `PerplexityBot` | Perplexity | Answer-engine index — primary traffic driver for compliance / standards content. Re-check quarterly that they have not merged into training. |
| `Perplexity-User` | Perplexity | On-demand fetch. |
| `Meta-ExternalFetcher` | Meta | On-demand fetch for Meta AI answers. |
| `Googlebot` · `Bingbot` · `Applebot` · `DuckDuckBot` | various | Search engines (and Gemini / Copilot answers cite from their indexes). Keep. |
| `Slackbot` · `Twitterbot` · `LinkedInBot` · `WhatsApp` · `TelegramBot` · `DiscordBot` · `FacebookExternalHit` | social | Link-preview unfurls — drive traffic. Always allow. |

Re-check this split quarterly per `refresh-cadence.md`. Vendor UA policies change.

### Six-layer defence (operational)

**L1a robots.txt** — site-wide training-bot blocks + citation-bot path-scoped blocks. Honour-system, but catches respectful crawlers (which is most of them). Shipped 2026-05-19 at `robots.txt`.

**L1b llms.txt** — stays as-is. Active invitation for citation engines on free core. Shipped.

**L1c TDMRep `tdm-policy.json`** at site root — formal machine-readable rights reservation per EU CDSM Directive 2019/790 Article 4. Required for legal weight in EU. Reserves training rights site-wide, reserves all TDM rights on paid paths. Shipped 2026-05-19 at `tdm-policy.json`.

**L1d Page-level meta + headers (paid pages only)** — `<meta name="robots" content="noai, noimageai, nosnippet">` + `X-Robots-Tag: noai, noimageai` HTTP header. Per-page opt-out signal honoured by Bing + Adobe + others. To ship with first paid surface.

**L2 Edge bot management** — Cloudflare Bot Management (preferred — already aligned with planned Cloudflare Pages hosting). DataDome / Akamai / HUMAN as alternatives. Fingerprints TLS handshakes, headless-browser quirks, residential-proxy patterns, behavioural anomalies. **This is the real enforcement layer** — catches UA spoofing, which L1 cannot. Whitelist legitimate citation UAs above. Apply strict to paid paths.

**L3 Auth-wall** — customer accounts, SCORM downloads, certificate verifier, audit-pack CSV exports, partner portal, admin. Login + per-account rate limits + session-behaviour anomaly detection. Primary defence for paid surfaces; everything else is belt-and-braces.

**L4 Rate limit + WAF + CAPTCHA** — per-IP and per-ASN at edge. Cloudflare Turnstile or hCaptcha (both work without trackers, both pass WCAG). Distinct policy: free-core gets generous limits (don't penalise legitimate readers); paid paths get strict.

**L5 Client obfuscation (paid product only)** — no clean public API; signed requests; rotate endpoint paths quarterly with rolling deprecation; minify + code-split JS bundles for paid surfaces. Free-core HTML stays clean and accessible.

**L6 Honeypots + canary content** — honeypot URLs reachable only via hidden links (auto-block on hit). Canary strings embedded in customer-account exports + certificate PDFs + SCORM payloads. Monthly search-the-web for canary strings to detect leaks. Rotation log at `.audit/security/canary-tokens.md` (to build).

### Free-core posture summary

- All free pages return 200 to: ChatGPT-User, OAI-SearchBot, Claude-Web, PerplexityBot, Perplexity-User, Meta-ExternalFetcher, Googlebot, Bingbot, Applebot, DuckDuckBot, all social link-preview bots, all humans.
- All free pages return 403 (via robots + bot-mgmt) to: GPTBot, ClaudeBot, anthropic-ai, CCBot, Bytespider, Amazonbot, Applebot-Extended, Meta-ExternalAgent, every other training-only crawler.
- `llms.txt` continues to invite citation engines. TDMRep file says "training reserved" — does not block citation.
- Net effect: ChatGPT users can ask "what does AI Safe@Work say about EU AI Act Art 4?" and get a cited answer with a link, driving traffic. OpenAI cannot ingest our content for GPT-6 training. Common Crawl cannot redistribute it as training feedstock. Best of both.

### Paid-surface posture summary

- All paid pages return 403 to: every named AI crawler (training or citation), every scraper signature, every non-authenticated request.
- Auth-wall is primary; everything else is layered defence.
- TDMRep + meta + headers add machine-readable opt-out for the small subset of crawlers that respect them.
- Edge bot-mgmt enforces against UA spoofing.

### Procurement-facing benefit

- "Is our content ingested by AI models?" → "No. Free educational content is opt-in for AI citation (with link-back) and opt-out for training. Paid surfaces are entirely blocked. Posture published at `tdm-policy.json` and reviewed quarterly."
- Add to vendor questionnaire response template.

### Verification — quarterly + on any robots.txt or tdm-policy change

Run **both** tests below. Both must pass. Record result in `.audit/security/anti-scraping-verification-YYYY-QN.md`.

#### Test 1 — Free-core citation engines still reach in (the wedge is intact)

Goal: confirm citation / answer-engine crawlers can still fetch + cite our free content.

| Step | Action | Pass criterion |
|---|---|---|
| 1 | Open ChatGPT. Paste: `Read https://attest-ai.com/module-3.html and list the 9 categories of data that should never go into a public AI tool.` | ChatGPT returns the 9 categories AND shows the URL as a source link. |
| 2 | Open Claude. Same prompt. | Same. |
| 3 | Open Perplexity. Same prompt (or browse to perplexity.ai and ask). | Returns the 9 categories with our URL listed in the source pills. |
| 4 | Open Google. Search `site:attest-ai.com "never-paste"` | Module 3 appears in results. |
| 5 | Open Bing. Same search. | Module 3 appears in results. |

**Fail = wedge broken.** Investigate immediately: check robots.txt for accidental blanket `Disallow: /`, check `tdm-policy.json` for syntax errors, check no edge bot-mgmt rule went too broad, check Google Search Console for "blocked by robots.txt" warnings.

#### Test 2 — Rules are present and correct in the served files

Goal: confirm the published `robots.txt` and `tdm-policy.json` actually contain the intended rules (no deploy regression).

| Step | URL | What to verify present |
|---|---|---|
| 1 | <https://attest-ai.com/robots.txt> | `User-agent: GPTBot` followed by `Disallow: /` — confirms training-bot block site-wide |
| 2 | same | `User-agent: ChatGPT-User` followed by `Disallow: /paid/` and `Allow: /` — confirms citation-bot allowed on free, blocked on paid |
| 3 | same | `User-agent: CCBot` → `Disallow: /` — confirms Common Crawl block (indirect training-data protection) |
| 4 | same | `Sitemap: https://attest-ai.com/sitemap.xml` line still present |
| 5 | <https://attest-ai.com/tdm-policy.json> | Returns valid JSON; `"tdm-reservation": 1`; `"prohibited-purposes"` array includes `training-of-machine-learning-models`; `"last-reviewed"` date within last 90 days |
| 6 | <https://attest-ai.com/llms.txt> | Still present (citation engines depend on it); covers free-core paths only |

**Fail = deploy regression.** Roll back to last good commit, re-validate, redeploy.

#### Bonus — bot-traffic sanity check (once Cloudflare Bot Mgmt enabled)

| Step | Action | Pass criterion |
|---|---|---|
| 7 | Open Cloudflare Bot Analytics dashboard. Filter last 7 days. | `GPTBot` shows ≥1 request, all blocked (200/0%, 403/100%). `ChatGPT-User` shows ≥1 request, all allowed on free paths. |
| 8 | Filter to `Path = /paid/*` for last 7 days. | All AI-crawler UA hits = blocked. Auth-required hits = 401/403. |

If `GPTBot` shows ANY 200 responses on any path → robots.txt or edge rule is misconfigured.
If `ChatGPT-User` shows 403s on free paths → wedge broken, fix immediately.

### Open TODOs

- [x] robots.txt with training-vs-citation split — shipped 2026-05-19
- [x] tdm-policy.json — shipped 2026-05-19
- [x] Page-level `noai, noimageai, nosnippet` meta tags on `pricing.html` + `msp.html` — shipped 2026-05-19
- [x] `X-Robots-Tag: noai, noimageai, nosnippet, noindex, nofollow` header on paid paths via Netlify `_headers` — shipped 2026-05-19
- [ ] `.audit/security/canary-tokens.md` rotation log
- [ ] Cloudflare Pages + Bot Management decision (currently on Netlify; Cloudflare planned at canonical-domain move)
- [x] Public-facing `/security.html` posture statement — shipped 2026-05-19
- [ ] Quarterly re-review of citation vs training UA split per `refresh-cadence.md`
- [x] First execution of Test 2 (verification) on Netlify deploy 2026-05-19 — **PASS**. Test 1 deferred until canonical domain indexed (4 weeks post-DNS)
- [ ] Schedule Test 1 + Test 2 quarterly thereafter (Feb / May / Aug / Nov first week)
- [x] Create `.audit/security/anti-scraping-verification-2026-Q3.md` template — shipped 2026-05-19

### Layer 2 — bot management at the edge

- Cloudflare Bot Management (preferred — site already plans to deploy via Cloudflare Pages so layered switch is cheap) · DataDome · Akamai Bot Manager · HUMAN.
- Fingerprints TLS handshakes, headless-browser quirks, residential-proxy patterns, behavioural anomalies — far stronger than user-agent string matching.
- Apply to paid + auth'd paths. Whitelist known good (Googlebot, Bingbot, Slackbot, archive.org, plus the AI crawlers above for free paths only).

### Layer 3 — auth-wall every commercially-valuable surface

- Customer accounts, SCORM downloads, certificate verifier, audit-pack CSV exports, partner portal, admin: all behind login.
- Per-account rate limits.
- Anomaly detection on session behaviour (login-volume, geo-shift, parallel sessions, scrape-shaped request patterns).
- Marketing / free-course pages will get scraped — that's fine and is the trust signal.

### Layer 4 — rate limiting + WAF

- Per-IP and per-ASN rate limits at edge.
- WAF rules for known scraper signatures.
- CAPTCHA / JS challenge on suspicious traffic (Cloudflare Turnstile or hCaptcha — both work without trackers, both pass WCAG).
- Distinct policy: free-core paths get generous limits (don't penalise legitimate readers); paid paths get strict.

### Layer 5 — client obfuscation (paid product only)

- No clean public API. Require signed requests on customer APIs.
- Rotate endpoint paths quarterly with rolling deprecation.
- Minify and code-split JS bundles for paid product surfaces.
- Won't stop a determined reverse engineer — raises cost. Free-core HTML stays clean and accessible.

### Layer 6 — honeypots + canary content

- Honeypot URLs reachable only by scrapers that follow hidden links — auto-block on hit.
- Canary strings embedded in customer-account exports + certificate PDFs + SCORM payloads — search for the canary across the web monthly to detect leaks.
- Canary records logged in `.audit/security/canary-tokens.md` (to build).
- Detection + provenance, not prevention.

### Free-core posture (unchanged)

- Free pages: 12 modules + Relevant Roles + templates + standards-map + citations + changelog + accessibility + complaints + privacy + terms + pricing draft + landing + course overview.
- `llms.txt` continues to invite AI consumption.
- robots.txt keeps `Allow: /` for these paths even for AI crawlers (Layer 1 blocks apply only to `/paid/` etc).
- Honeypots may live anywhere (Layer 6 is detection-only and does not break free-core ingestion).

### Why this matters commercially

- Without these, an AI crawler scraping the paid product surface will give buyers a free version of what they paid for, via ChatGPT prompts.
- Enterprise customers will ask "is our content ingested?" in procurement. Need an honest "no, paid surfaces are blocked" answer.
- Doctrine § audit-readiness requires controlled data flows. Unbounded scraping of paid material is a controlled-data-flow failure.

### TODO before launching any paid surface

- [ ] Confirm hosting choice (Cloudflare Pages strongly preferred for free-tier Bot Management features).
- [ ] Write path-scoped robots.txt rules; ship pre-launch.
- [ ] Enable Cloudflare Bot Management on `*.attest-ai.com/{paid,account,customer,api,admin}/*` (or equivalent paths).
- [ ] Build `.audit/security/canary-tokens.md` with the rotation log.
- [ ] Add honeypot URL to paid HTML (hidden from humans + free-tier crawlers).
- [ ] Document the policy on a public-facing page (`/security.html` or extend `accessibility.html` model — short statement of posture).
- [ ] Add to vendor questionnaire: "we apply X to all paid surfaces" so procurement teams can verify.

---

## SEO targets

Pillar pages owe ranking against:

| Keyword | Page |
|---|---|
| `ai literacy training eu ai act` | new — EU Art 4 pillar |
| `ai security awareness training` | new — replaces KnowBe4-style query |
| `ai for employees course` | landing — repurpose `course.html` |
| `chatgpt at work training` | Module 2 / 3 landing |
| `shadow ai training` | Module 4 landing |
| `ai data leak prevention training` | Module 3 landing |
| `ai phishing training` / `deepfake awareness training` | Module 6 landing |
| `ai governance course free` | `course.html` — strongest wedge vs IAPP |
| `corporate ai policy template` | new — templates pack |
| `ai acceptable use policy training` | manager track |
| `iso 42001 training online` | bridge page |
| `gdpr ai training` | Module 12 sub-page |
| `ai compliance training small business` | SMB landing — wedge-defining |
| `dora ai training` | finance overlay |
| `nis2 ai training` | critical-infra overlay |

People-Also-Ask FAQ candidates (seed `FAQPage` schema): see audit doc.

---

## Cadence

- **Weekly** — link-rot + broken-anchor sweep
- **Monthly** — readability + Lighthouse + WCAG smoke
- **Quarterly** — rule-tracking refresh: ICO + CNIL + EDPB + AI Office + ENISA + NIST + relevant case law. Bumped version, dated changelog.
- **Yearly** — full content audit, sector-overlay refresh, accreditation re-validation, partner check-ins.

---

## § Refresh cadence — operational

> Added 2026-05-19. Operationalises the cadence above.

**Triggers**

- Calendar reminders for the first week of February, May, August, November.
- Subscribed mailing lists: ICO, CNIL, EDPB, EU AI Office, ENISA, NIST AI, ISO/IEC SC 42, OWASP GenAI, CSA AI — all listed in `.audit/course-quality/refresh-cadence.md`.

**Per-cycle outputs**

- `citations-bibliography.md` walked — every entry's URL resolves; every claim still matches; flags resolved or escalated.
- `changelog.md` and public `changelog.html` updated.
- All page footers bumped to new `vYYYY.MM`.
- JSON-LD `dateModified` bumped.
- Doctrine "Decision log" updated if posture changed.

**Skip protocol**

- If a cycle is missed, the next cycle is prioritised above any new content.
- Two consecutive missed cycles triggers a public banner on every page: "Last reviewed YYYY-MM-DD — pending refresh." This is intentional. The point of the banner is to make slippage publicly visible to ourselves, not to hide it.

**Owner:** Founder. Single point of failure noted in risk register R-3 (bus factor).

---

## § Audit-readiness

> Added 2026-05-19. Treats AI Safe@Work as the *organisation that produces the course*, not just the course. We are a deployer of AI and a processor of (minimal, today) personal data ourselves.

**Posture**

- We do not certify against ISO 42001 or 27001. We follow their structure to be defensible if audited by a buyer, an insurer, or a supervisory authority.
- We eat our own dogfood. The AUP in the templates pack is filled in for our own staff at `.audit/ai/aup-own-staff.md`.
- Audit-pack documents live in `.audit/` tracked in git but excluded from `robots.txt`. Public-facing equivalents (accessibility, complaints, citations, changelog) live at site root.

**Mandatory artefacts** (must exist before any commercial launch or buyer audit)

| Bucket | Artefact | Location |
|---|---|---|
| Legal | Registered legal entity | TBD before first sale |
| Legal | Insurance — PI / E&O + cyber | TBD before first sale |
| Legal | Terms of Service — commercial | extend `terms.html` |
| Privacy | Records of Processing Activities | `.audit/privacy/ropa.md` ✓ |
| Privacy | Sub-processor register | `.audit/privacy/sub-processors.md` ✓ |
| Privacy | DPIA on own AI use | `.audit/privacy/dpia-own-ai-use.md` ✓ |
| Privacy | Breach-response plan | `.audit/privacy/breach-response-plan.md` ✓ |
| Privacy | Retention schedule | `.audit/privacy/retention-schedule.md` ✓ |
| Security | ISMS one-pager | `.audit/security/isms-policy.md` ✓ |
| Security | Risk register | `.audit/security/risk-register.md` ✓ |
| Security | Asset register | `.audit/security/asset-register.md` ✓ |
| Security | Access-control register | `.audit/security/access-control.md` ✓ |
| Security | Incident log | `.audit/security/incident-log.md` ✓ |
| Security | Annual review record | `.audit/security/annual-review-2026.md` ✓ |
| AI | Use-case inventory | `.audit/ai/ai-use-case-inventory.md` ✓ |
| AI | AUP for own staff | `.audit/ai/aup-own-staff.md` ✓ |
| AI | AI training register | `.audit/ai/ai-training-register.md` ✓ |
| AI | AI incident log | `.audit/ai/ai-incident-log.md` ✓ |
| Course quality | Interactive widget audit | `.audit/course-quality/svg-audit.md` ✓ (added 2026-05-27 — per-module SVG decision log) |
| Course quality | Citations bibliography | `.audit/course-quality/citations-bibliography.md` ✓ + public `citations.html` ✓ |
| Course quality | Changelog | `.audit/course-quality/changelog.md` ✓ + public `changelog.html` ✓ |
| Course quality | Refresh cadence | `.audit/course-quality/refresh-cadence.md` ✓ |
| Course quality | Accessibility audit + statement | `.audit/course-quality/accessibility-audit-2026.md` ✓ + public `accessibility.html` ✓ |
| Course quality | Complaints procedure | public `complaints.html` ✓ |
| Discoverability | Sitemap + robots + llms | `sitemap.xml`, `robots.txt`, `llms.txt` ✓ |
| Discoverability | JSON-LD per page | All 23 pages ✓ |
| Discoverability | OG + Twitter meta per page | All 23 pages ✓ |

**Pre-commercial-launch checklist** (added to gates list above as gates 16–20)

- 16: Registered legal entity + business bank account separate from personal.
- 17: PI / cyber insurance active.
- 18: Commercial Terms of Service published (extend `terms.html`).
- 19: HTTPS on canonical domain.
- 20: External screen-reader accessibility audit complete.

**Update protocol for audit artefacts**

- New artefact: documented BEFORE the activity it covers begins.
- Material change: re-record same week.
- Quarterly: re-walked alongside the standards refresh.
- Annual: full review per `.audit/security/annual-review-YYYY.md`.

**Audit response readiness**

- Buyer audit: respond within 10 business days with relevant `.audit/` artefacts + Standards Map + citations.
- Supervisory authority enquiry: respond per GDPR / EU AI Act timelines (max 30 days for SAR; 72 hours for breach notification).
- Insurance audit: respond within timeframe set by underwriter (typically 30 days).

**Reg basis**

- GDPR Arts 5, 24, 30, 33–35, 39
- EU AI Act Arts 4, 13, 26, 27, 50, 73
- ISO/IEC 42001 Clauses 5–9, Annex A
- ISO/IEC 27001 Cl 4–10, Annex A.5–A.8 selected controls

---

## § Content standards: evidential accuracy and wording precision

> Added 2026-06-13. Establishes the bar for factual claims and the protocol for wording refinement when claims need softening due to evidential limits.

**Core principle**: Claims must be defensible. If a claim cannot be sourced to a named incident (Module 1 style), a published research paper, a court case, or a regulatory position, it gets softened to "significant and growing", "increasingly", "may be", or "depends on how they are used" — language that acknowledges uncertainty while remaining useful to the reader.

**Examples of refinements made 2026-06-13** (following stakeholder review):

| Module | Original wording | Refined wording | Why |
| --- | --- | --- | --- |
| 6 | "Half the phishing you see this year was written, edited or refined by AI" | "A significant and growing proportion of phishing attacks are now written, edited or enhanced using AI" | Original claim difficult to evidence. No single study establishes "50%" globally. Refined version acknowledges the trend (evidenced in industry reports) without overstating. |
| 6 | "indistinguishable from real" (video deepfakes) | "increasingly difficult to distinguish from real" | Current state of deepfakes varies by context. Some are indistinguishable; many are still spotable. Refined version matches the actual technical reality (improving, not arrived). |
| 6 | "the 72-hour clock starts when you notice" (GDPR breach reporting) | "organisations may have reporting obligations once they become aware of a personal data breach" | Original oversimplified GDPR Art 33 timing and basis. Refined version is more legally precise: obligation starts on awareness, but the clock is from discovery, not necessarily from notice to the individual. |
| 7 | "any AI system used in this category counts as high-risk" (EU AI Act) | "certain AI systems used in these categories may be classified as high-risk under the EU AI Act, depending on how they are used" | Original was too categorical. EU AI Act Annex III lists categories but application depends on use case. Refined version is more legally precise. |
| 7 | "the rules now apply to that activity" | "additional governance, oversight and compliance obligations may apply" | Original suggested binary on/off. Refined version acknowledges that obligations vary by use case, data handling, and jurisdiction. |

**Governance insight boxes added 2026-06-13**:

- **Module 6**: "Social engineering remains primarily a human problem. AI increases the scale, quality and speed of attacks, but governance, awareness, verification processes and strong authentication remain the most effective controls."
- **Module 7**: "Bias management is not about removing all bias from AI. It is about identifying potential sources of unfairness, applying appropriate controls and ensuring accountability for decisions."

**Other wording clarifications 2026-06-13**:

- Module 6: Added section on Business Email Compromise (BEC) as one of the costliest AI-enhanced fraud scenarios, reflecting practitioner feedback that BEC is underrepresented in SMB awareness training.
- Module 6: Clarified that EU AI Act Article 50 (transparency on AI-generated content) "applies in specific circumstances and does not automatically prevent criminal misuse" — addressing the misconception that labelling alone stops misuse.
- Module 7: Clarified that GDPR Article 22 (automated decision-making) "applies to certain automated decisions that produce legal or similarly significant effects on them — not all AI-assisted decisions."
- Module 7: Softened claim on image generation ("Image generation models are improving but still require human review for representation, diversity and appropriateness") to acknowledge progress while maintaining the need for human oversight.
- Module 7: Added "procurement" as an example audience for high-risk AI decisions, recognising that vendor selection and procurement governance increasingly fall within AI governance responsibilities.
- Module 6: Clarified that "It's just a draft" defence fails not because AI is used, but because "allowing AI-generated recommendations to influence decisions without appropriate review and challenge" is the risk.

**Protocol for future wording refinements**:

1. **Identify** — When a claim cannot be backed to a primary source (case, paper, regulator statement, incident), flag it for refinement.
2. **Source check** — Search for named incidents or published evidence. If found, cite it. If not found, soften the language.
3. **Approve** — Refinements requiring wording change above the typo level go through stakeholder review (DPO, legal counsel if applicable, or community feedback).
4. **Document** — Record the change, original wording, refined wording, and reason in the changelog and this section.
5. **Backport** — If the same claim appears in multiple modules, backport the refined wording.

---

## § Strategic doctrine + growth framework

> Added 2026-05-19. Locks the long-arc strategic posture on top of the operational doctrine above. Compatible with — not replacing — § Position-the-wedge and § Audience hierarchy. Where text below appears to broaden the wedge, treat the original wedge as the **acquisition engine** and this strategic framework as the **revenue engine**. They co-exist.

### Purpose

AI Safe@Work exists to help organisations adopt AI safely, responsibly and operationally via: awareness training · governance enablement · compliance guidance · operational risk reduction · advisory services.

Sits at the intersection of: AI adoption · cyber awareness · governance · operational maturity · procurement · compliance · safe technology enablement.

Long-term objective: scalable AI governance ecosystem with recurring subscription revenue · MSP distribution partnerships · governance tooling · advisory services · eventual acquisition potential.

### Strategic positioning

**Not**: "AI training platform".
**Is**: "**AI Governance Awareness & Enablement Platform**".

Strategic differentiator: not AI productivity itself — safe AI adoption · operational governance · accountability · compliance awareness · risk reduction · operational maturity.

Translate governance + compliance concepts into practical operational guidance that employees, managers, MSPs, compliance teams, SMBs can realistically understand + adopt.

### Core market problem

Most organisations already use AI tools (ChatGPT · Microsoft Copilot · Google Gemini · Claude · Perplexity · Meta AI · Grok · AI browser plugins · AI transcription · AI-enabled SaaS) **without** governance · awareness training · AUP · operational controls · approval processes · procurement oversight · accountability structures.

Operational risks: confidential data leakage · GDPR exposure · IP loss · unmanaged "shadow AI" · hallucinated outputs · supplier/vendor risk · reputational damage · inaccurate decisions · governance failures.

AI Safe@Work exists to **operationalise** safe AI usage for SMBs + regulated orgs.

### Strategic market direction

AI governance market expected to evolve like cyber-security awareness · GDPR readiness · governance/compliance maturity services.

Becoming increasingly: procurement-driven · insurer-driven · compliance-driven · audit-driven · operationally expected.

Recurring-revenue opportunities: subscriptions · governance packs · MSP licensing · white-labelled platforms · governance tooling · advisory retainers · enterprise consulting.

### § Primary route to market — MSP-first

**Primary distribution channel: MSP partnerships.** This supersedes the direct-to-SMB Phase-1 launch slice in priority once MSP traction lands.

MSPs already own: trusted customer relationships · IT/security conversations · governance discussions · recurring managed-services models.

AI Safe@Work gives MSPs: immediate AI governance offering · recurring revenue · customer retention/stickiness · strategic differentiation · governance credibility · entry into higher-value advisory conversations.

§ Sales partners section is the operational mechanism for this — MSP partners are the priority class, RORtech Partners Limited is the first authorised reseller in onboarding.

### Target markets

Primary: SMBs · MSP customers · regulated SMEs · professional services · healthcare · recruitment firms · legal/accountancy firms · defence supply chain · public sector suppliers · education orgs.

Aligns with § Market sizing — sector targets prioritise: professional services, DORA-bound financial SMB, healthcare, public sector, education.

### Core platform components — three layers

1. **Awareness platform** (scalable SaaS layer) — employee awareness training · role-based learning · governance awareness · operational guidance · standards mapping · refresher learning · certification · audit evidence.
2. **Governance enablement** (operational layer) — AUPs · governance templates · AI risk registers · vendor questionnaires · governance checklists · AI incident processes · approval workflows · operational governance guidance.
3. **Advisory + consultancy** (strategic consulting layer) — governance workshops · AI maturity reviews · governance operating models · ISO/IEC 42001 readiness · governance assessments · operational implementation · retained advisory.

### Role-based learning expansion

Expand beyond employee awareness into operational accountability + governance ownership.

Tracks:

| Track | Status |
|---|---|
| Employee Awareness | shipped (12 modules) |
| Manager / Leadership | shipped (`module-manager.html`) |
| DPO / Compliance | shipped (`module-dpo.html`) |
| Governance & Procurement | planned |
| MSP / IT Admin | planned (priority — feeds MSP-first route) |
| AI Governance Officer | planned |

Expands buyer surface beyond HR/training budgets into: governance · compliance · operational risk · procurement · leadership.

### AI platform governance coverage — active

Maintain operational governance + awareness coverage around major AI ecosystems currently used inside organisations.

Coverage: ChatGPT · Microsoft Copilot · Google Gemini · Claude · Perplexity · Meta AI · Grok · AI browser extensions · AI note-taking/transcription tools · AI summarisation assistants · AI SaaS integrations.

### Operational governance themes — consistent across platforms

Confidential data handling · "never-paste" guidance · hallucination + output verification · human oversight · IP protection · GDPR/privacy implications · acceptable-use boundaries · AI-generated misinformation · enterprise-vs-free-tier risk differences · operational accountability.

### Microsoft Copilot — dedicated governance track

Build dedicated Microsoft Copilot governance track. Reasons: rapid enterprise adoption · widespread M365 usage · strong MSP alignment.

Focus areas: SharePoint/Teams permissions exposure · oversharing risks · data classification · governance controls · operational rollout guidance · enterprise governance.

= major MSP + enterprise consulting opportunity. Add to expansion roadmap.

### Developer + technical AI governance

Governance awareness around: AI coding assistants · GitHub Copilot · source code/IP exposure · AI-generated scripting · infrastructure automation risks · secure developer AI usage.

Creates MSP governance offerings · development governance · enterprise operational consulting.

### Shadow AI — core strategic theme

Track as platform theme. Covers: unapproved AI tools · personal AI accounts · AI browser extensions · unsanctioned SaaS adoption · unmanaged AI workflows · operational AI sprawl.

Expected to be one of the largest governance + operational risk challenges for SMBs + MSPs over coming years.

### AI tool approval + governance enablement

Help orgs operationalise: approved AI tool lists · AI tool classifications · vendor risk assessments · procurement governance · approval workflows · governance ownership.

Evolves platform from awareness → operational governance enablement.

### § Commercial structure — hybrid SaaS + consultancy

**Two-entity model** (target structure):

| Entity | Responsibilities |
|---|---|
| **NewCo** (SaaS) | Platform ownership · SaaS subscriptions · awareness platform · downloadable governance packs · MSP licensing · white-labelled offerings · governance tooling · scalable IP |
| **Consultancy** | Governance implementation · workshops · maturity reviews · ISO/IEC 42001 readiness · governance operating models · strategic advisory · retained consulting |

Separation protects: SaaS scalability · acquisition potential · high-margin consulting opportunities.

**Current state**: single founder, single legal entity TBD. Two-entity split is a target, not immediate. Document the separation in pricing + delivery now so it survives entity creation.

### § Commercial pillars

| Pillar | Purpose |
|---|---|
| **1. Awareness SaaS** | Scalable recurring revenue · market adoption · recurring MRR · customer acquisition |
| **2. Governance Packs** | Governance enablement · operational tooling · consultancy lead generation |
| **3. Advisory + Consulting** | High-margin strategic services · enterprise governance · retained advisory · operational implementation |

### § Governance pack strategy

Practical self-service governance tooling · operational templates · implementation starting points.

Key packs:

- AI Acceptable Use Policy (shipped — `templates/aup-template.html`)
- AI Vendor Questionnaire (shipped — `templates/vendor-questionnaire.html`)
- AI Risk Register template (planned)
- AI Incident Process template (planned)
- Governance Checklists (planned)
- Approval Workflows (planned)
- Governance Quick Start Guides (planned)
- Procurement Governance Pack (planned)
- Manager Governance Pack (planned)

Packs intentionally enable self-service adoption AND naturally create implementation / governance review / advisory opportunities.

### § MSP ecosystem strategy

Evolve into white-labelled MSP governance enablement ecosystem.

Potential MSP offerings:

- AI governance bundles
- Governance subscriptions
- White-labelled awareness portals
- Governance dashboards
- Policy libraries
- Governance assessments
- Managed governance services

Creates: strong recurring MRR · customer stickiness · strategic differentiation · scalable distribution.

### § MSP commercial model

> Added 2026-05-19. Operationalises § MSP ecosystem strategy. Locks the pricing + revenue-share posture for MSP channel.

**Core model**: low monthly platform fee + revenue share on upsells.

**Why this and not heavy upfront**: reduces friction · faster adoption · aligns incentives · MSP feels upside without heavy commitment. MSP must think *"easy to add into our stack, low risk, scalable upside"* — NOT *"another expensive platform commitment"*.

#### Revenue-stream mix

| Stream | Model | Why it works |
|---|---|---|
| Platform access | Monthly MSP subscription | Predictable recurring MRR for us |
| White-labelling | Included in higher tiers | Increases MSP buy-in |
| Awareness training | Included user bands | Easy bundling into MSP's existing support contracts |
| Governance packs | Revenue share | Encourages MSP to actively sell |
| Consultancy | Referral / rev share | Creates strategic partnership |
| Enterprise projects | Joint delivery | Larger customer opportunities |

#### MSP pricing tiers

| Tier | Price | Includes | Best for |
|---|---|---|---|
| **Tier 1 — Partner MSP** | **£499/mo** | White-labelled platform · 250–500 users · governance templates · awareness modules · certificates · MSP sales collateral | Testing adoption · smaller MSPs · early partners |
| **Tier 2 — Growth MSP** | **£1,499/mo** | Multi-tenant dashboard · larger user allowance · governance packs · quarterly governance updates · co-branded content · partner onboarding support | Established MSPs · active customer rollout |
| **Tier 3 — Strategic MSP Partner** | **£3k–£5k+/mo** | Enterprise support · strategic governance partnership · co-delivered consulting · roadmap input · exclusive territories/sectors · governance workshops · advisory access | Serious growth partnerships |

#### Revenue share — layered on top of subscription

Subscription = predictable MRR. Revenue share = motivation to actively sell. Both required.

| Service | Split (MSP / NewCo) | Rationale |
|---|---|---|
| Awareness subscriptions | **70 / 30** | MSP owns the customer relationship; weight to them |
| Governance packs | **50 / 50** | Joint value; even split |
| Workshops | **30 / 70** consultancy | Delivered by us; MSP introduces |
| ISO/IEC 42001 projects | **20 / 80** consultancy | Heavy expertise lift; us-weighted |
| Advisory retainers | **20–30%** MSP referral fee | Long-tail; MSP origination credit |

Principle: **SaaS/platform → MSP-weighted · Consultancy → expertise-weighted.** Feels commercially fair to both sides.

#### Why this works structurally

| MSP owns | NewCo owns |
|---|---|
| Customer relationships | Governance expertise |
| Account managers | Platform |
| Trust | Consulting capability |
| Distribution | Operational maturity |

Split mirrors who carries the cost.

#### Critical rule

**Do NOT try to make all the money from the platform subscription up front.** Slows adoption. Real value = distribution · recurring expansion · governance upsells · consulting.

#### MSP positioning framing

Present as: *"A low-friction recurring governance service MSPs can quickly roll out across their existing customer base."*

MSPs love: monthly recurring revenue · attach-rate services · sticky offerings · low operational overhead · customer retention tools. Model ticks all five.

#### The killer commercial angle

MSPs can bundle AI Safe@Work into:

- Managed IT
- Cyber packages
- Microsoft 365 support
- Compliance offerings
- Onboarding services
- Cyber awareness suites
- vCIO services

Effect: **increases overall contract value without huge delivery overhead**. Most attractive line for the MSP buyer.

#### § Founding MSP Partner programme

Offer "Founding MSP Partner" status to first 3–5 MSPs.

Includes:

- Discounted rates (50% off Year 1 across Tier 1/2/3)
- Direct influence over product roadmap
- Preferred pricing on year-2 renewal (max +10% uplift)
- Co-branding rights (mutual logo + case-study placement)
- Possible territory or sector exclusivity (subject to volume commitment)
- Quarterly partner advisory call

Creates urgency · buy-in · partnership mentality (vs vendor/reseller dynamic).

RORtech Partners Limited is the **first Founding MSP Partner** slot — terms TBD per onboarding.

#### The sweet spot — full model recap

| Component | Purpose |
|---|---|
| Low monthly MSP fee | Easy adoption |
| White-labelled SaaS | Sticky recurring revenue |
| Revenue share | Incentivised selling |
| Governance packs | Mid-tier margin |
| Consultancy referrals | High-margin upside |
| Advisory retainers | Long-term strategic revenue |

Creates **scalable SaaS + recurring MSP revenue + high-margin consultancy upside simultaneously**.

#### Open TODOs — MSP commercial model

- [ ] Draft MSP partner agreement template (extends `.audit/legal/partners/README.md`)
- [ ] Draft Founding MSP Partner programme spec (5-slot cap, terms, exclusivity rules)
- [x] Build `/msp.html` MSP partner page on site — shipped 2026-05-19 (noindex draft, 3-tier pricing + revenue-share + Founding Partner programme)
- [ ] Build per-tier feature matrix (Tier 1 vs Tier 2 vs Tier 3) for MSP onboarding pack
- [ ] Build MSP sales collateral pack (one-pager + objection-handler + ROI calculator)
- [ ] Build multi-tenant dashboard spec (Tier 2+ feature) — even a stub static-HTML demo
- [ ] Build white-label spec (custom domain + theme + nav + logo) — same as Enterprise tier in `pricing.html`
- [ ] Build revenue-share tracking model (spreadsheet or simple SaaS — invoices, reconciliation, MSP statements)
- [ ] RORtech contract: capture Founding MSP Partner terms specifically (discount %, roadmap input, exclusivity if any)
- [ ] Announce Founding MSP Partner programme publicly once 1 partner signed (creates FOMO for next 4)

### § Expansion roadmap

Stay aligned to: governance · operational maturity · compliance · safe technology adoption.

Recommended expansion areas:

- Cyber Security Awareness 2.0
- Secure Microsoft Copilot Adoption
- Shadow IT + SaaS Governance
- AI Procurement Governance
- AI Governance Practitioner Certifications
- Sector-Specific Governance Packs
- Governance-as-a-Service
- Operational Excellence Programmes
- ITIL + AI Operations Governance

**Avoid**: becoming a generic e-learning provider.

### § Long-term vision

Become: "**the AI governance awareness + enablement platform for SMBs and MSPs**".

Layer roles:

| Layer | Role |
|---|---|
| Awareness platform | acquisition engine · trust-building · recurring subscription foundation |
| Governance tooling + consultancy | strategic revenue engine · enterprise value driver · long-term acquisition opportunity |

Long-term objective: governance-focused SaaS ecosystem · supported by MSP partnerships · governance tooling · operational enablement · recurring subscriptions · high-margin advisory.

**Core business philosophy**: *"Helping organisations adopt emerging technologies safely, responsibly and operationally."*

### Reconciliation with existing doctrine

| Existing section | Status under strategic doctrine |
|---|---|
| § Position-the-wedge (non-tech SMB) | Unchanged — wedge is the acquisition engine that feeds Pillar 1. Strategic doctrine expands ABOVE the wedge, not in place of it. |
| § Pricing-Phase-1 (Pro Cert £49 + Starter £299) | Unchanged — direct-to-SMB launch slice. MSP white-label tier added as separate sales motion (see § Sales partners + § MSP ecosystem strategy). |
| § Sales partners (RORtech first reseller) | Promoted — MSP is now the **primary route to market** per § Primary route. Sales-partners section becomes the operational mechanism. |
| § Audience hierarchy | Expanded — add MSP / IT Admin and Governance Officer tracks alongside existing Relevant Roles. P-numbers unchanged. |
| § Audit-readiness | Strengthened — two-entity NewCo + Consultancy split adds future complexity but maps cleanly (each entity needs its own RoPA, ISMS, etc.). |
| § Anti-scraping + AI-crawler controls | Unchanged — paid surfaces only; MSP white-label is a paid surface, so already protected by existing scope. |

### § Open strategic TODOs

- [x] Update `index.html` lede + positioning copy to lead with "AI Governance Awareness + Enablement Platform" — shipped 2026-05-19
- [ ] Build Microsoft Copilot governance track outline
- [ ] Build Shadow AI track outline
- [ ] Build MSP / IT Admin Relevant Role
- [ ] Build Governance & Procurement Relevant Role
- [ ] Build AI Governance Officer Relevant Role
- [ ] Build remaining governance packs (Risk Register · Incident Process · Approval Workflows · Procurement Pack · Manager Pack · Governance Quick Start)
- [x] Build dedicated MSP page (`/msp.html`) — partner programme, white-label terms, MSP-specific pricing — shipped 2026-05-19
- [ ] Draft MSP white-label commercial terms (extends `pricing.html` Enterprise tier)
- [ ] Two-entity (NewCo SaaS + Consultancy) structure decision: when, what jurisdiction, profit split
- [ ] Advisory / consulting day-rate + retained-advisory pricing
- [ ] Reframe `course.html` to position Awareness Platform as one of three pillars
- [ ] Sector-specific governance packs (Healthcare · Financial Services · Public Sector · Education · Legal · Defence supply chain)
- [ ] ITIL + AI Operations Governance positioning paper (Pillar 3 entry into ops-heavy MSPs)

---

## § Go-to-market — remaining launch actions (added 2026-07-06)

> Ground-truth audit of what still blocks a real go-to-market. Verified against the live site + DNS on 2026-07-06, not aspirational. Product is built (12 core modules + 6 role tracks + 3 sector overlays, all with interactive figures + MCQ quizzes; templates; portals; demo funnel). What is missing is the **commercial and infrastructure plumbing** to actually take a visitor → lead → paying customer. Ranked by whether it blocks launch.

### ★ Current status snapshot — 2026-07-08 (single source of truth)

Legend: ✅ done · 🟡 built/ready-to-arm · 🧑 human-only step remaining · 🤖 buildable by Claude · ❌ not started

| Ref | GTM action | Status | The one remaining step |
|---|---|---|---|
| A1 | Canonical domain `attest-ai.com` live over HTTPS | 🧑 not done | Finish Netlify custom-domain + SSL, set primary, 301 the `*.netlify.app` origin |
| A2 | Arm portal auth (flip `AUTH_DISABLED=false`, rotate/delete demo, redeploy) | 🟡 **code done** | Now a *flip*, not a build — front-door auth (password+TOTP, magic-link, reset) built this session; do it the instant real user data appears |
| AUTH-1 | Supabase custom SMTP + raise rate limits + redirect allowlist | 🧑 not done | Configure SMTP (Resend), raise Auth email cap, allowlist `…/portal/login.html`. **Blocks all auth email** (hit the built-in cap 08 Jul) |
| A3 | Business email `hello@attest-ai.com` (Google Workspace) | 🧑 not done | Add MX/SPF/DKIM/DMARC in 123reg DNS; create `hello@`; point Netlify demo-form notification at it |
| A4 | Commercial (paid-tier) Terms | 🟡 **draft shipped** | Solicitor review, then it can leave `noindex` with B-track |
| B1 | Payment rail (Stripe, UK) | 🤖+🧑 not started | Claude scaffolds Checkout + webhook → `grant_credits`/`invite-seat` (seams exist); human supplies Stripe account + keys |
| B2 | Finalise + publish prices, lift `pricing.html` `noindex` | 🧑 decision | Set £ figures + one-off/subscription model per tier (business decision); Claude then applies `Offer` schema + lifts noindex |
| B3 | Post-purchase fulfilment (provision seat / deliver pack on payment) | 🤖 blocked on B1 | Wire the payment webhook to the existing `invite-seat`/`grant_credits` seams |
| C1 | Cookieless analytics | 🤖+🧑 not started | Netlify Analytics (dashboard toggle) or a Plausible snippet (needs account) — keep zero-cookie |
| C2 | Search Console + sitemap submission | 🧑 after A1 | Submit `sitemap.xml` to Google+Bing once the canonical domain is indexed (runs anti-scraping Test 1) |
| C3 | Launch changelog entry | 🤖 after A1 | One release note when the domain goes live |
| D1 | Execute RORtech reseller agreement | 🧑 not done | Sign; fill Territory/Tiers/Margin in § Sales partners; log the PDF |
| D2 | Activate Founding MSP Partner programme | 🧑 not done | Open first-cohort recruitment |
| D3 | Demo → sale loop (SLA, owner, lead tracking) | 🧑 needs A3 | Define who replies to demo leads from `hello@` and where they're logged |
| SEC-A09 | Security audit logging (populate `audit_log` on credit/seat/login events) | 🤖 not started | Log sensitive server-side actions before real customers (open OWASP A09 gap) |
| SEC-A08 | Add SRI to the jsDelivr supabase-js script tag | 🤖 quick | Sub-resource-integrity hash on the CDN script |

**Done this session (no longer blockers):** pricing locked to the 3-tier model + site reconciled (AIMP = platform, not a tier); front-door auth **built** behind the flag (password+TOTP for managers/resellers, magic-link for team, self-serve reset, `invite-seat` Edge Function); credit model + `profiles` access control **hardened** (self-grant hole closed, verified); password-reset dead-end **fixed**; commercial Terms **drafted**; product **complete** (all 21 learning pages on the quiz engine; templates 22→27).

**Critical path to first £ (updated):** **A1** (domain) → **A3 + AUTH-1** (email + SMTP) → **B1** (Stripe) → **B2** (prices) → **B3** (fulfilment). **A4** (solicitor) gates lifting `pricing.html` off `noindex`; **A2** (arm auth) is now a one-line flip triggered by real data, not a build. C + D run in parallel and don't gate the first sale.

### A — Launch blockers (must clear before public "we are live")

| # | Action | State on 2026-07-06 | Ties to |
|---|---|---|---|
| A1 | **Canonical domain live over HTTPS** — finish `attest-ai.com` custom-domain + SSL on Netlify, set as primary, 301 the `*.netlify.app` origin to it | apex A points at Netlify but `https://attest-ai.com` returned no response — domain/SSL not finished; site still primarily on `aisafework.netlify.app` | § Distribution doctrine #1; anti-scraping Test 1 (deferred "until canonical domain indexed") |
| A2 | **Re-enable portal auth before any paying customer** — flip `AUTH_DISABLED=false` in `portal/assets/portal.js`, remove the demo credentials shipped in client JS, restore 2FA (MFA was stripped for inspection) | Auth intentionally OFF for inspection; demo creds public in JS; RLS still protects data | § Pre-launch checklist 2.5; Procurement-readiness gate 17 |
| A3 | **Business email `hello@attest-ai.com`** — Google Workspace chosen; add MX + SPF + DKIM + DMARC in 123reg DNS, create `hello@` alias/group, point the Netlify demo-form notification at it | No MX records; demo-form leads currently land nowhere a human reads | demo funnel (`about.html#contact` Netlify form) |
| A4 | **Commercial Terms of Service extension** — publish the paid-tier terms; blocker before `pricing.html` leaves `noindex` | **DRAFT SHIPPED 2026-07-08** — commercial (paid-tier) terms added to `terms.html`: licence/IP, payment + subscription, cancellation/refunds, availability, data/DPA, acceptable use, liability cap (12-month fees), termination, England & Wales law. Flagged "finalising under legal review; definitive version shown at checkout". **Human step remaining: solicitor review before pricing leaves `noindex`.** | § Procurement-readiness gates item 18; § Pre-launch checklist 1.5 |

### B — Revenue plumbing (cannot take money until these exist)

| # | Action | State on 2026-07-06 | Ties to |
|---|---|---|---|
| B1 | **Payment rail** — pick one (Stripe = fastest for UK), wire Tier-1 one-off (Plus Pack / templates) + Tier-2 AIMP subscription | No Stripe/Paddle/any checkout anywhere in the repo | § Commercial scope; SCOPE.md tiers |
| B2 | **Finalise + publish prices** — decide public-price vs quote-only per tier, add real `Offer` prices, lift `pricing.html` `noindex` once A4 + B1 land | `pricing.html` is `noindex`; Offer schema present but no £ figures; visible prices are placeholders | § Commercial scope guardrails; SCOPE.md scope-creep gate |
| B3 | **Post-purchase fulfilment** — on payment: provision the AIMP seat / deliver the templates pack; today the portal auto-logs-in a demo account only | Fulfilment path not wired to any purchase event | § MSP commercial model; portal seats/credits model |

### C — Measurement + discoverability (needed to run GTM, not to open the doors)

| # | Action | State on 2026-07-06 | Ties to |
|---|---|---|---|
| C1 | **Privacy-friendly analytics** — cookieless (Plausible / Fathom / Netlify Analytics); no cookie banner, keeps zero-cookie posture | None installed | § Pre-launch checklist 1.2/1.3 (must stay zero-cookie) |
| C2 | **Search Console + sitemap submission** — submit `sitemap.xml` to Google + Bing Search Console once A1 is live; confirm indexing (runs anti-scraping **Test 1**) | `sitemap.xml` exists but unsubmitted; Test 1 explicitly deferred to 4 weeks post-DNS | Open TODOs → "Schedule Test 1 + Test 2 quarterly"; § Distribution doctrine #6 (EU/UK-first SEO) |
| C3 | **Launch changelog entry** — first public release note when the domain goes live; quarterly cadence already automated via the `quarterly-content-refresh` routine | Changelog live; no "launch" entry yet | § Refresh cadence; llms.txt quarterly promise |

### D — Sales + partner activation (parallel track, not launch-blocking)

| # | Action | State on 2026-07-06 | Ties to |
|---|---|---|---|
| D1 | **Execute RORtech reseller agreement** — sign, then fill Territory / Tiers / Margin in the § Sales partners table and log the agreement PDF | Row present, "Onboarding · contract pending", all terms TBD | § Sales partners onboarding requirements |
| D2 | **Activate Founding MSP Partner programme** — open recruitment for the first cohort | Programme defined in doctrine; not yet opened | § Founding MSP Partner programme |
| D3 | **Define the demo → sale loop** — SLA + owner for replying to demo-form leads from `hello@`, and where leads are tracked (lightweight CRM or a log) | Demo form captures; no defined follow-up process | A3; § Distribution doctrine |

**Critical path to first pound of revenue:** A1 → A3 → A4 → B1 → B2 → B3. Everything else can trail. C and D run in parallel and do not gate the first sale.

### Update — 2026-07-08 (reconciled after product completion + email/domain diligence)

**Product side is now effectively launch-ready — the remaining GTM work is entirely infra + commercial.** Shipped since 2026-07-06: every learning page now carries an interactive MCQ quiz on the shared engine (12 core modules + all 6 Relevant Roles + all 3 sector overlays — previously the 9 tracks/overlays used self-mark `<details>`); templates pack expanded 22 → 27 with the EU AI Act technical-evidence artefacts OneTrust has and we lacked (AI System Card / Art 11+Annex IV, Data Governance Record / Art 10, Post-Market Monitoring Plan / Art 72, Agent Register, Use Case Intake); AIMP portal audit closed (case-insensitive seat email, seat removal + credit refund, CSV completion export, regulatory-updates surface, module-11 finale reachable). None of this changes the blocker list below; it removes "product not finished" as an excuse.

**State changes to the A–D tables:**

| Ref | Change since 2026-07-06 |
|---|---|
| A2 | A formal **SECURITY TRIPWIRE** comment now sits on `AUTH_DISABLED` in `portal.js` (added during 07 Jul security review). The demo password ships in this PUBLIC repo → treat as burned. Hard gate, now written into the code: **before any real client/user data enters the Supabase project — (1) `AUTH_DISABLED=false`, (2) delete/rotate the `demo@attest-ai.com` account, (3) redeploy.** MFA was stripped for inspection; decide at flip time whether to restore it. |
| A3 | Email host **decided: Google Workspace**. DNS confirmed: registrar is **123-Reg**, but nameservers are GoDaddy's `domaincontrol.com` (123reg runs on GoDaddy's DNS platform) → **records are added in the 123reg control panel**, not a separate GoDaddy account. Exact records prepared this session (MX `smtp.google.com` pri 1; SPF `v=spf1 include:_spf.google.com ~all`; DMARC `_dmarc` `p=none`; DKIM from the Workspace admin console). Still zero MX live. |
| A3 / D3 | **Book-a-Demo now captures for real** (verified live 2026-07-13). It was a dead `mailto:`, replaced with a **Netlify Form** (`about.html#contact`) → branded `demo-thanks.html`. BUT Netlify **Forms was disabled at the site level**, so every submit 404'd (leads went nowhere). Fixed: enabled Forms via the Netlify API + redeployed so form detection registered the `demo` form (fields name/email/company/team_size/message + honeypot); end-to-end tested (submit → thank-you page, submission recorded, test rows deleted). Leads now land in **Netlify dashboard → Forms → `demo`**. Remaining wiring: **add the email notification → `hello@` once A3 lands** (Forms → notifications). |
| Auth | **Front-door auth built (behind `AUTH_DISABLED`).** Gated Log-in on the main nav; managers/resellers = password + TOTP MFA + self-serve password reset; team members = passwordless magic link. Manager **invite-a-seat** is a JWT-verified, service-role **`invite-seat` Edge Function** (creates/invites the end-user + seats them via `assign_seat`; blocks the public demo account as anti-spam while auth is open). Arming needs: Supabase email/SMTP configured + `…/portal/login.html` in the redirect allowlist, then flip A2. |
| **B4 / SECURITY** | **Credit model fixed.** Credits were `default 0` with no grant mechanism, and the `profiles` self-update RLS let a manager set their **own** `credits_balance`/`role` from the browser (self-grant / self-promote hole). **Closed 2026-07-08**: column-level grants restrict client self-update to `full_name` only, and INSERT/DELETE on `profiles` revoked from anon/authenticated (defense-in-depth). Verified by black-box tests as an authenticated manager: self-set credits/role → 403, mass-assign UPDATE → 403, privileged INSERT → 403 (grant-level), IDOR update of another user → 0 rows; signup trigger still provisions profiles. Credits now move only via SECURITY DEFINER fns. Added **`grant_credits(uuid,int)`** (service-role/webhook + admin only; authenticated → 403) as the seam the **Stripe purchase webhook** will call to top up a manager's balance. Until payments exist, credits are admin-provisioned at account creation (as the demo's 500 were). |

**Newly-surfaced actions (add to the tables):**

| # | Action | State | Ties to |
|---|---|---|---|
| A5 | **Redirect the spare TLDs** — `attest-ai.info / .net / .online / .store` → 301 to `attest-ai.com` (123reg domain forwarding). Owned, currently unpointed. | Not set | A1; brand protection |
| A6 | **Netlify Forms notification** — email demo-form submissions to `hello@attest-ai.com` (dashboard toggle, ~2 min once A3 exists). | Not set | A3, D3 |
| B4 | **Post-purchase Supabase wiring** — on payment, set the buyer's Supabase Auth Site URL/redirect allowlist + provision role + credits (the seams exist; nothing is connected to a payment event). | Not wired | B1, B3 |

Money/domain/DNS actions remain **human-only** (per operating principles): I prepare records, recipes and copy; Alastair executes the purchase/DNS/Workspace/Stripe steps. **Critical path unchanged:** A1 → A3 → A4 → B1 → B2 → B3, with A2 as the non-negotiable gate the instant any real user data appears.

### ✅ Consolidated remaining GTM checklist — single source of truth (reconciled 2026-07-08)

**Done this session (removed as blockers):** product complete (quizzes site-wide, 27 templates incl. EU-AI-Act evidence pack); AIMP portal audit closed; front-door auth built behind `AUTH_DISABLED` (password+TOTP, magic-link, reset, invite-seat Edge Function); paid-tier Terms drafted; demo funnel live (Netlify form); credit-model security hole closed + `grant_credits` seam; email/DNS records + runbooks prepared. **Pricing locked to the simple 3-tier model** (Tier 1 Training · Tier 2 Plus Pack · Tier 3 Consultancy); **AIMP repositioned as the delivery platform, not a tier**, reconciled site-wide (pricing, homepage copy + FAQ + FAQPage schema, llms.txt, plus-pack, terms); `profiles` access-control hardened (self-grant hole closed, black-box verified); em-dash house style applied to llms.txt.

**The rest that still needs completing** — owner is who must act (🧑 = Alastair / account-gated · 🤖 = Claude can do in-repo/DB now · 🧑+🤖 = human account step then I wire):

| ID | Remaining action | Owner | Gated on |
|---|---|---|---|
| A1 | Finish `attest-ai.com` custom domain + SSL on Netlify; set primary; 301 `*.netlify.app` | 🧑 | — |
| A3 | Google Workspace signup + MX/SPF/DKIM/DMARC in 123reg; create `hello@` | 🧑 | — |
| A5 | 301 the spare TLDs (`.info/.net/.online/.store`) → `.com` (123reg forwarding) | 🧑 | — |
| A6 | Netlify Forms → email demo leads to `hello@` | 🧑 | A3 |
| AUTH-1 | **Supabase custom SMTP + rate limits + redirect allowlist** — HARD blocker for all auth email (reset, magic-link, invite). The built-in Supabase sender is dev-grade: ~a few emails/hour and per-address (hit **"email rate limit exceeded"** during reset testing, 08 Jul), and lands in spam. **(a)** Auth → Emails → configure **custom SMTP** — recommend **Resend** (3k/mo free, ~5-min setup, transactional-grade); Amazon SES at scale; Gmail SMTP via the Workspace `hello@` is possible but ~500/day + app-password and weaker for transactional. **(b)** Auth → Rate Limits → raise the email cap once SMTP is live. **(c)** Auth → URL Configuration → set Site URL + add `…/portal/login.html` (netlify **and** attest-ai.com) to Redirect URLs so reset/magic-link/invite links land on the login page. Until SMTP is live, provision/confirm test accounts directly in the DB (bcrypt + `email_confirmed_at`) so testing doesn't burn the cap. | 🧑 | A3 |
| A2 | Flip `AUTH_DISABLED=false`, rotate/delete demo account, redeploy (the tripwire) | 🧑+🤖 | AUTH-1; any real data |
| A4 | Solicitor review of the drafted paid-tier Terms before pricing leaves `noindex` | 🧑 | — |
| B1 | Stripe account + checkout for the paid tiers (Tier 2 Plus Pack; Tier 3 Consultancy; payment model per tier shown at checkout) | 🧑+🤖 | Stripe keys |
| B2 | **Tier contents now locked** (Training / Plus Pack / Consultancy, shipped 2026-07-08). Remaining: set real prices + per-tier payment model, add `Offer` values, lift `pricing.html` `noindex` | 🧑+🤖 | A4, B1 |
| B3/B4 | Payment webhook → `grant_credits` + provision role/seat on purchase | 🤖 | B1 |
| C1 | Cookieless analytics (Plausible/Fathom/Netlify) | 🧑+🤖 | account |
| C2 | Submit sitemap to Google/Bing Search Console; run anti-scraping Test 1 | 🧑 | A1 |
| C3 | Public "launch" changelog entry | 🤖 | A1 |
| D1 | Execute RORtech reseller agreement; fill terms in § Sales partners | 🧑 | — |
| D2 | Open Founding MSP Partner cohort recruitment | 🧑 | — |
| D3 | Define demo→sale SLA + lead tracking (CRM or log) | 🧑 | A3 |
| SEC-A09 | Audit logging on sensitive actions (`grant_credits`, `assign_seat`, `remove_seat`, invite, sign-in) — procurement/OWASP A09 gap; DB-side | 🤖 | — |
| SEC-A08 | Add SRI hash to the jsDelivr `supabase-js` script (minor integrity) | 🤖 | — |

**Fastest path to first revenue:** A1 → A3 → A4 → B1 → B2 → B3. **Highest-value work I can do without any of your accounts:** SEC-A09 (audit logging), B3/B4 (webhook→`grant_credits`, ready to connect the moment Stripe exists), C3 (launch note).

---

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-07-08 | **Pricing simplified to three tiers**: Tier 1 AI Safe@Work Training · Tier 2 Plus Pack (governance toolkit) · Tier 3 Consultancy. MSP framing: Course → Course + Plus Pack → Course + Plus Pack + Consultancy. **AIMP repositioned** as the delivery platform (the portal customers log in to), NOT a separately-sold subscription tier. Reconciled site-wide: pricing.html, homepage copy + FAQ + FAQPage JSON-LD, llms.txt, plus-pack.html, terms.html. Tier contents locked; only prices + payment model remain (B2). | Simple, MSP-legible packaging; kills the "is AIMP a tier or the platform?" ambiguity that made the offer hard to explain |
| 2026-07-08 | **Password-reset flow fixed + email infra decided.** The reset link established a session and the login load-race routed past the set-new-password form (and only detected the implicit `#type=recovery`, not PKCE `?code=`); now any auth callback is event-classified so recovery always lands on (and stays on) the reset form. Separately, hit **"email rate limit exceeded"** on Supabase's built-in dev sender → decision: **custom SMTP (Resend) is a hard launch prerequisite**, folded into AUTH-1 with the rate-limit raise + redirect allowlist. Test accounts to be DB-provisioned meanwhile to spare the cap. | Reset was a dead end for real users; built-in email can't carry production auth (deliverability + throughput) |
| 2026-07-08 | **Credit model + access control hardened.** Closed the `profiles` self-update hole (any logged-in manager could self-grant credits / self-escalate role from the browser): column-grant lockdown + INSERT/DELETE revoke, verified by black-box exploitation tests (self-grant/mass-assign/insert/IDOR all 403/blocked). `grant_credits()` service-role function added as the seam the Stripe purchase webhook will call. Front-door auth built behind `AUTH_DISABLED` (password+TOTP for managers/resellers, magic-link for team, self-serve reset, `invite-seat` Edge Function). Open security gaps logged: SEC-A09 (audit logging), SEC-A08 (script SRI). | Money/privilege integrity before real accounts exist; auth ready to arm (A2) at launch |
| 2026-07-06 | § Go-to-market remaining-launch-actions section added | Ground-truth audit: product built, but commercial/infra plumbing (domain+SSL, business email, payment rail, public prices, commercial ToS, re-enable auth) still blocks first revenue. Critical path recorded A1→A3→A4→B1→B2→B3 |
| 2026-05-19 | Initial doctrine locked | Established wedge, principles, gates |
| 2026-05-19 | Caveman doctrine prose style for internal docs | Speed; matches user preference |
| 2026-05-19 | Static HTML only; no JS framework | Maintainability, free hosting, no build |
| 2026-05-19 | Amber accent (#e8a726) on dark glass | Caution / warmth; distinct from win2linux teal |
| 2026-05-19 | Cinematic background system v1 shipped | Premium feel without busy distraction |
| 2026-05-19 | Standards Map + Manager + DPO + AUP + Vendor questionnaire pages shipped (v1.1) | Closed doctrine gates 1, 6 (partial), 7 (partial) |
| 2026-05-19 | Citations bibliography + public citations.html | Kills pre-mortem risks #3 (audit failure via misstated clause) and #4 (hallucination in published content) |
| 2026-05-19 | Changelog + refresh-cadence operationalised | Kills pre-mortem risk #1 (content rot); subscribed mailing lists added as TODO |
| 2026-05-19 | sitemap.xml + robots.txt + llms.txt + JSON-LD on all 23 pages + OG/Twitter meta on all 23 pages | Closed doctrine gates 13, 14; kills pre-mortem risk #15 (search invisibility) |
| 2026-05-19 | `.audit/` pack established: RoPA, sub-processors, DPIA, breach plan, retention, ISMS, risk, asset, access, incidents, AI inventory, AI training register, AUP for own staff | Audit-readiness foundation; eats own dogfood |
| 2026-05-19 | accessibility.html + complaints.html published; accessibility-audit-2026.md self-assessment filed | Public-sector + insurance readiness; visible bar for further improvement |
| 2026-05-19 | Doctrine § audit-readiness and § refresh-cadence-operational locked | Project graduates from "course product" to "course-producing organisation" |
| 2026-05-19 | Doctrine § Sales partners added. First entry: **RORtech Partners Limited** as authorised reseller (onboarding · contract pending) | Establishes channel-partner model; free core remains free regardless of channel |
| 2026-05-19 | Doctrine § Anti-scraping + AI-crawler controls added. Six-layer defence (robots.txt, edge bot-mgmt, auth-wall, rate-limit + WAF, client obfuscation, honeypots + canary). Scoped to paid + auth'd surfaces only — free core remains AI-citable per `llms.txt`. | Protect commercial surfaces before launch without breaking trust-signal posture |
| 2026-05-19 | § Anti-scraping refined: split AI crawlers into TRAINING (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Bytespider`, `Amazonbot`, `Applebot-Extended`, `Meta-ExternalAgent` …) — blocked site-wide — and CITATION / answer-engine (`ChatGPT-User`, `OAI-SearchBot`, `Claude-Web`, `PerplexityBot`, `Perplexity-User`, `Meta-ExternalFetcher`) — allowed on free core, blocked on paid. Ships robots.txt + tdm-policy.json (EU CDSM Art 4 opt-out). | Resolves bot-blocker vs free-core-wedge tension: training drains us, citation drives traffic. Different UAs, treat differently. |
| 2026-05-19 | § Anti-scraping verification protocol added: Test 1 (citation engines reach free core — ChatGPT / Claude / Perplexity / Google / Bing) + Test 2 (robots.txt + tdm-policy.json + llms.txt rules present and correct on served files). Both required quarterly + on any change to robots / tdm-policy. Recorded in `.audit/security/anti-scraping-verification-YYYY-QN.md`. | Verifiable proof both wedge intact and training-drain stopped. Without tests, drift goes undetected until traffic dies. |
| 2026-05-19 | § Strategic doctrine + growth framework locked. Strategic positioning shifts from "AI training platform" to "**AI Governance Awareness + Enablement Platform**". Three commercial pillars: Awareness SaaS · Governance Packs · Advisory + Consulting. **Primary route to market = MSP partnerships**. Two-entity target structure: NewCo (SaaS) + Consultancy. Existing free-core wedge becomes the acquisition engine for Pillar 1. RORtech Partners Limited reclassified as first MSP partner (was generic reseller). Dedicated tracks planned for Microsoft Copilot · Shadow AI · MSP / IT Admin · Governance & Procurement · AI Governance Officer · Developer + Technical AI. Long-term vision: governance-focused SaaS ecosystem distributed via MSPs with consultancy revenue engine, eventual acquisition target. | Codifies long-arc strategic posture; reconciles direct-to-SMB launch with MSP-first scale; prevents drift into "generic e-learning provider" trap. |
| 2026-05-19 | § MSP commercial model locked. **Low monthly MSP fee + layered revenue share**. Three tiers: Partner MSP **£499/mo** · Growth MSP **£1,499/mo** · Strategic MSP Partner **£3k–£5k+/mo**. Revenue-share splits — awareness subscriptions **70/30 MSP**; governance packs **50/50**; workshops **30/70 consultancy**; ISO/IEC 42001 projects **20/80 consultancy**; advisory retainers **20–30% MSP referral**. Founding MSP Partner programme: first 3–5 MSPs get 50% Year-1 discount, roadmap input, co-branding, possible territory/sector exclusivity. RORtech Partners Limited = first Founding slot. **Critical rule**: do NOT extract all value from platform subscription up front — slows adoption; revenue lives in distribution + expansion + governance upsells + consulting. | Right pricing posture for MSP psychology: predictable MRR for us, low risk + active upside for them; bundles cleanly into managed IT / cyber / M365 / vCIO stacks → raises MSP contract value without delivery overhead. |
| 2026-05-19 | **Doctrine guardrails implemented on live deploy** (Netlify `aisafework.netlify.app`). Shipped: `netlify.toml` + `_headers` with site-wide HSTS / CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy + path-scoped `X-Robots-Tag: noai, noimageai, nosnippet` on `/paid/`, `/account/`, `/customer/`, `/api/`, `/admin/`, `/pricing.html`, `/msp.html`, `/.audit/`. `noai, noimageai, nosnippet` meta on `pricing.html`. New `/security.html` public posture page + `/msp.html` MSP commercial model page (draft, noindex). Index reframed to lead with "AI Governance Awareness + Enablement Platform". Sitemap updated. `llms.txt` updated with security page. Test 2 (verification) executed against live Netlify deploy: **PASS** — GPTBot blocked, ChatGPT-User path-scoped, CCBot blocked, Sitemap directive present. First verification record filed at `.audit/security/anti-scraping-verification-2026-Q3.md`. | Move doctrine from documented-intent to live-enforced. Auto-deploys to Netlify on push. |

| 2026-06-03 | **Gates 1, 4, 5 closed — procurement table reconciled.** Gate 1 standards-map already shipped 2026-05-19 (table desync only). Gate 4 (SCORM 1.2 + xAPI) shipped commit `310daf6`: imsmanifest.xml, scorm-api.js, xapi-adapter.js, build-scorm.py, dist .zip 61227 bytes, buyer README. Gate 5 (FR + DE shells) shipped same commit: 26 files under `v2/fr/` + `v2/de/`, locale-aware modules.json + v2.js, machine-translation banner pending native review, 15/15 smoke URLs returned 200. Week-one block now reduced to gates 13 + 14 (v2-aware re-pass). | Honest doctrine table = honest procurement story. Three procurement gates closed in one session. |
| 2026-06-03 | **Gates 9, 13, 14 closed; gate 12 partial.** Gate 9: RSS 2.0 + JSON Feed v1.1 for changelog (`/changelog.xml`, `/changelog.json`) + v2026.06 release entry in `changelog.html`. Gate 13/14: idempotent SEO splicer `scripts/inject-v2-seo.py` injected JSON-LD (`WebSite` / `Course` / `LearningResource` / `BreadcrumbList`) + canonical + hreflang triples (en/fr/de/x-default) + OpenGraph + Twitter card across 39 v2 pages. Smoke: RSS + JSON Feed parse-clean; JSON-LD parse-clean on 5 sampled pages (EN landing, EN course, EN/FR/DE modules). Gate 12 partial: RDAP availability scan + Cloudflare-registrar purchase recipe + Vercel/Netlify DNS recipe filed at `.audit/legal/domain-procurement-2026-06-03.md` — purchase blocked on user financial action. v2 sitemap entries DEFERRED until `noindex` lifted (consistency with founder MVP scope). | One session: full week-one procurement block closed; quarter-one block (gates 6, 7) is next. |
| 2026-06-03 | **Gate 7 closed — templates pack complete.** Four new templates under `/templates/`: `training-register.html` (EU AI Act Article 4 audit-grade evidence record, 8-column schema, 30 fill fields), `dpia-template.html` (GDPR Article 35 / EDPB WP248 rev.01, full risk-matrix, Article 36 prior-consultation trigger, 69 fill fields), `incident-form.html` (GDPR Art 33/34 + AI Act Art 73 + NIS2 Art 23 + DORA Art 19 reporting-window reference card, timeline + RCA + closure, 58 fill fields), `fria-template.html` (EU AI Act Article 27, 7 Charter rights matrix, Article 14 human oversight, Article 27(3) market-surveillance-authority notification, 84 fill fields). Each: printable A4, JSON-LD `HowTo`+`BreadcrumbList`, canonical URL, standards-mapping section, sign-off grid. Wired into `course.html` Templates section (2 → 6 cards) + sitemap.xml (4 new URLs at priority 0.8-0.85). Smoke: JSON-LD parse-clean on all four; sitemap valid XML (32 URLs total). | Quarter-one block now reduced to gate 6 only. Templates are the highest-density procurement artefact per session-hour spent. |
| 2026-06-03 | **Gate 5 finishing step ready — translator-vendor sourcing pack filed.** `.audit/legal/translator-sourcing-2026-06-03.md` contains: (1) scope statement, (2) per-file word-count breakdown with EN/FR/DE estimates totalling ~37,300 target words across 26 files, (3) 4-tier vendor shortlist with 15+ candidates and pricing bands (Tier 1 £0.20-0.30/word ISO 17100 specialist agencies including Lionbridge / RWS / TransPerfect / Acolad / Welocalize; Tier 2 £0.10-0.18/word mid-market boutique including Veritas / Kwintessential / London Translations / Espresso / TextMaster; Tier 3 £0.05-0.12/word freelancer marketplaces including ProZ / TranslatorsCafé / Smartcat; Tier 4 in-house via MSP partners), (4) paste-and-send RFQ template with subject-matter brief covering EU AI Act terminology + GDPR + ISO standards + quality bar + sample-module test, (5) acceptance criteria + sample-quality bar with worked EN→FR/DE example, (6) budget calculation tables: FR £1.4-3.6k, DE £1.6-3.9k, all-in £3.4-8.6k by tier; recommended Tier 2 sample-then-commit at ~£5k, with co-fund / pre-sale funding routes, (7) post-review integration plan: diff-review, smoke, banner removal, modules.json update, vendor attribution, doctrine flip, sitemap lift. Pack ready to send. User action required: send RFQ to 3-vendor shortlist; 6-10 week timeline to gate 5 fully DONE. | Pre-procurement work that converts the gate-5-shell-shipped state into a defined commercial path. Removes "needs translator budget" from the deferred-list ambiguity into a specific quote-able request. |

| 2026-06-03 | **Gate 6 CLOSED 5/6 → 6/6 — Governance &amp; Procurement role track shipped.** `/module-procurement.html` is the sixth and final role track. 10 sub-modules per outline at `.audit/course-quality/role-track-outlines/governance-procurement.md`. Topics: (1) Why AI procurement differs — six properties that break traditional SaaS templates (model swap, sub-processor chain, training opacity, output non-determinism, classification drift, vendor-of-vendor); (2) 37-Q vendor questionnaire as buying instrument — 6 usage steps + 5 highest-signal questions + lock-into-contract pattern; (3) AI vendor DPA review — 4 critical clauses (scope incl training use, sub-processor with teeth, data return + deletion verification, Schrems II + TIA); (4) Sub-processor disclosure — depth-2 verification routine + foundation-model-provider as sub-processor + concentration-risk implications; (5) EU AI Act Article 13 — 7 procurement-evidence categories the provider must supply; (6) Article 26 deployer obligation procurement-shaping table — 7 sub-clauses mapped to procurement actions; (7) Sector framework mapping — 10-row matrix covering FS (UK + EU + US), Healthcare (UK + EU + US), Public Sector (UK + EU), Education, Energy; (8) Contracting for change — model-swap notice/review/pause/termination + term-change notification + exit + data return no-hostage + IP and bias indemnification; (9) Buy / build / compose / defer decision tree — 5 steps + TCO model + "defer is legitimate" warning; (10) 10-question assessment. Original. Wired course.html (Role tracks 6 cards), llms.txt (6th Role entry + lede bump to "6 role tracks"), sitemap.xml priority 0.88. Outline status SHIPPED. | Gate 6 FULLY CLOSED. Closes the procurement-persona content gap and provides the upstream complement to MSP / IT Admin track sub-module 5 customer-onboarding. Procurement is the buying side; MSP track is the operating side; rollout guide is the running side. Three angles on the same governance question now all have content. |

| 2026-06-03 | **Gate 10 CLOSED 2/3 → 3/3 — Public Sector sector overlay shipped.** `/sector-public-sector.html` is the third and final sector overlay. 9 sub-modules per outline at `.audit/course-quality/sector-overlays/public-sector.md`. Topics: (1) 11-row public-sector regulatory stack (EU AI Act Annex III + Art 26 + Art 27 + Art 50; UK AI Playbook; ATRS; UK GDPR + DPA 2018; PSBAR + EAA; NIS2; FOI/EIR; Equality Act PSED; judicial review; ombudsmen; parliament + select committees + NAO); (2) 12-category public-sector never-paste list — National Insurance / NHS / UPN identifiers, casework, welfare-benefit assessments, council-tax + revenue collection, police / prosecution records (Schedule 8 DPA + LED), court-restricted reporting (contempt risk), Cabinet / Council / Committee confidential papers, citizens' letters + FOI pre-response, procurement evaluation, personnel + grievance, election restricted data — with FOI-leak-equals-published warning; (3) FRIA in practice — Article 27 mandatory triggers + 6-element scope + companion to DPIA + PSED s.149 + FOI-disclosability draft consideration; (4) ATRS Tier 1 (public summary) + Tier 2 (detail) + mandatory-vs-recommended scope + "not yet published" worst-answer warning; (5) AI-assisted citizen decisions — 4-lens defence (Art 22 + Art 14 + Art 86 + judicial review); 7-element defensible decision pattern; Article 86 right-to-explanation operational implication; (6) G-Cloud + DOS + AI DPS + EU Directive 2014/24/EU procurement + 10 AI-specific contract clauses + off-framework justification + NAO audit anticipation; (7) Public accountability matrix — 9 audiences (citizens / decision-affected citizens / electeds / ICO / FRIA-recipient SA / NAO + C&amp;AG / select committees / FOI requesters / EHRC) with output + cadence + inherent tensions; (8) Incident escalation — first hour / 24h / 7day / 1 month phases + UK-specific routing (LGSCO / PHSO / devolved + ICO + EHRC + NAO + LGA); (9) 10-question assessment on citizen-decision FRIA judgement + ATRS publication + commercial-confidentiality refusal + procurement-route audit + vendor-update obligations. Original-format overlay matching FS + Healthcare shell (blue accent, JSON-LD `LearningResource` + `BreadcrumbList`, standards-stack callout, table-driven sub-modules, signature takeaways). Wired course.html Sector overlays (3 cards), llms.txt (3rd entry + lede bump to "3 sector overlays"), sitemap.xml priority 0.85. Outline status SHIPPED. | Gate 10 FULLY CLOSED. Third vertical sales motion unlocked. All three target sectors (FS, Healthcare, Public Sector) live. Possible direct conversation with DSIT / GDS / Cabinet Office now feasible per outline sales-motion note. Public-sector MSPs through G-Cloud framework have a complete deliverable. |

| 2026-06-03 | **Gate 10 advanced 1/3 → 2/3 — Healthcare sector overlay shipped.** `/sector-healthcare.html` is the second sector overlay following the FS pattern (blue-accent visual differentiator). 9 sub-modules + 10-question assessment per outline at `.audit/course-quality/sector-overlays/healthcare.md`. Topics: (1) Healthcare regulatory stack — GDPR Art 9 special-category + national derogations + EU AI Act + EU MDR + MHRA AI-as-MD + NHS DSPT + DCB0129/0160 + NICE ESF + CQC + HIPAA cross-ref + NIS2; (2) 12-category healthcare never-paste list — NHS number, clinical record, prescription, diagnostic images, genetics, mental-health, safeguarding, sexual-health, reproductive-health (jurisdiction-sensitive), suicide records, donor/transplant, insurance claims — with pseudonymisation-isn't-anonymisation warning; (3) AI as Medical Device — MDR Article 2(1) definition + Rule 11 software classification + 6 worked examples (summarisation, X-ray flag, AI receptionist, referral draft, mental-health chatbot, no-show prediction) + SMB deployer 5-step procurement test; (4) DCB0129 (manufacturer 5-element duty) + DCB0160 (deployer 5-element duty) + practical SMB workflow + CSO requirement; (5) Triage chatbot / AI receptionist combined regulatory load (MDR + AI Act Annex III §5(a) + GDPR Art 9 + Art 22 + Art 50 + CQC + Equality Act 2010) + 8 procurement red-flag patterns + "111-equivalent" trap warning; (6) Cross-border patient data — 6-row UK/EU/US flow matrix + AI-in-loop scenarios + Schrems-II adequacy-is-live warning; (7) Patient-safety reporting — 9-clock matrix (Yellow Card + MDR Art 87 + AI Act Art 73 + GDPR 33/34 + HIPAA Breach Notification + NHS DSPT + CQC Reg 18 + NIS2 + StEIS/LFPSE) + 7-step workflow; (8) Incident escalation order — 15min/2h/24h/7day phases + NHS-specific routing notes; (9) 10-question assessment exercising clinical-safety judgement, MDR threshold tests, DSPT impact analysis. 515-line single-page HTML. Wired course.html Sector overlays section (2 cards), llms.txt (2nd Sector entry + lede bump), sitemap.xml. Outline status SHIPPED. | Second vertical sales motion unlocked. Healthcare has the strongest regulatory urgency per outline + most layered framework (GDPR Art 9 + MDR + AI Act + national clinical-safety standards). NHS DSPT-connected practices are mandated readers. MSP serving healthcare gets a sector-specific deliverable to pre-sell alongside FS overlay. |

| 2026-06-03 | **Gate 10 advanced TODO → 1/3 — Financial Services sector overlay shipped.** `/sector-financial-services.html` is the first sector overlay. Single page, 9 sub-modules + 10-question assessment per outline at `.audit/course-quality/sector-overlays/financial-services.md`. Topics: (1) FS regulatory stack (EU AI Act + DORA + FCA + PRA + EBA + SR 11-7 + MiFID II + NYDFS + MAS FEAT + national regulators) layered on top of universal course; (2) FS-extended never-paste list — adds MNPI + SAR + AML/KYC investigation records + credit-model internals + trading positions + RRP + Pillar 3 pre-publication + regulator correspondence, with tipping-off-as-criminal-offence framing; (3) SR 11-7 / SS1/23 model risk management applied to AI — six lifecycle stages, where AI differs from traditional models, model inventory schema; (4) DORA Article 13 ICT third-party risk — eight requirements applied to AI vendors, concentration risk, exit strategy difficulty, CIF designation nuance; (5) AML/KYC AI — what works under human review, what doesn't, tipping off via AI customer-chatbot risk; (6) MiFID II Art 17 algorithmic trading + EU AI Act overlap; (7) FCA Consumer Duty Principle 12 + Section 21 for customer-facing AI; (8) parallel-regulator escalation matrix (first hour / 24h / week / NYDFS overlay); (9) 10-question assessment. 465-line single-page HTML. Blue accent (`var(--blue)`) instead of amber to visually distinguish sector overlays from role tracks. Wired course.html (new "Sector overlays" section between Role tracks and Templates), llms.txt (new section), sitemap.xml (priority 0.85). Skip-link injected; outline status SHIPPED. | First vertical sales motion unlocked. DORA enforcement live since 17 Jan 2025 — FS firms have the highest pay-willingness for AI-governance content per doctrine market-sizing. MSP partners serving FS now have a sector-specific deliverable to pre-sell. |

| 2026-06-03 | **Gate 6 advanced 4/6 → 5/6 — Shadow AI role track shipped.** `/module-shadow-ai.html` is the fifth role track and the second two-persona track (CISO/IT-lead persona reads sub-modules 3, 5, 6, 9; end-user persona reads 1, 2, 4, 7; both read everything). 10 sub-modules: (1) What Shadow AI is + why it spreads; (2) Four-shapes taxonomy with risk profile + intervention table (consumer chatbots / browser extensions / AI-in-SaaS / personal accounts); (3) Discovery-without-panic toolkit (proxy + DNS + SMP + CASB + browser inventory + survey + 1:1) with framing scripts that work + framings that destroy discovery; (4) Why bans fail (five reasons) + what works instead; (5) Acceptable-use posture (three must-says, three must-not-says); (6) Procurement gating (AI-feature inventory + material-change clause + quarterly sweep) + Article 28(2) sub-processor trigger; (7) End-user education with conversational scripts that land + manager curriculum; (8) Shadow-AI-flavoured incident response (preserve, vendor delete, don't punish reporter); (9) Days 0–30 discover / 30–60 procure+draft / 60–90 communicate-train-embed / 90+ steady state; (10) 10-question assessment. 482-line single-page HTML, JSON-LD `LearningResource` + `BreadcrumbList`. Wired course.html role-tracks grid (5 cards, eyebrow + lede → "five role tracks"), llms.txt (5th entry), sitemap.xml (priority 0.88). Skip-link injector run; canonical present; outline status SHIPPED. | Per doctrine "#1 operational AI risk in most SMBs". Provides the playbook AND the end-user explanation in one document — solves the asymmetric-knowledge problem that turns most Shadow AI conversations adversarial. Infosec Europe 2026 demand signal validates the priority. |

| 2026-06-03 | **Gate 6 advanced 3/6 → 4/6 — Microsoft Copilot role track shipped.** `/module-copilot.html` is the fourth role track. Single page, 12 sub-modules per outline at `.audit/course-quality/role-track-outlines/microsoft-copilot.md`: (1) Five-variant Copilot taxonomy + governance differences, (2) permissions-inheritance problem + SharePoint Advanced Management oversharing report, (3) five-lever data-residency picture + EU Data Boundary cautions, (4) Purview sensitivity labels + protection-not-label rule, (5) Copilot Studio agent governance + Power Platform environment strategy + DLP, (6) Microsoft 365 group hygiene as upstream control, (7) end-user prompt patterns (cite / boundary / two-step verify), (8) unified audit log + Article 26(6) retention extension, (9) Defender for Cloud Apps signal catalog + operationalisation, (10) Copilot-variant incident response first-hour (preserve evidence, fix permissions not Copilot), (11) universal-course relationship table, (12) 10-question assessment. 524-line single-page HTML, JSON-LD `LearningResource` + `BreadcrumbList`. Wired into course.html role-tracks grid (now 4 cards, eyebrow + lede → "four role tracks"), llms.txt (4th entry + lede bump), sitemap.xml (priority 0.88). Skip-link injector run; canonical present; outline status flipped to SHIPPED. | Closes the largest single-vendor AI-governance enablement gap for M365-using SMBs (estimated 200k+ EU+UK SMBs running M365 Business / Enterprise with Copilot pipeline active). MSP partners get the Copilot-rollout track they can pre-sell. |

| 2026-06-03 | **Gate 8 first-pass DONE — WCAG 2.2 AA audit + fixes.** Static audit across all 74 HTML files (35 v1 + 39 v2). Three Level A / AA fails fixed: (1) skip-to-content link sitewide via idempotent splicer `scripts/inject-skip-link.py` + `.skip-link` CSS (jumps to `#main` landmark; v2 + v1); (2) `:focus-visible` block expanded across all interactive elements in both stylesheets with `--focus-ring` var; (3) `--text3` colour bumped in both stylesheets to deliver 6.7:1 contrast vs `--bg` (was 2.6:1 v1, 4.1:1 v2 — both failed AA 4.5:1). 12-item findings table covers all sampled SCs from WCAG 2.2; 8 items (D1–D8) deferred to next-quarter manual + AT pass scheduled 2026-09. Audit doc `.audit/accessibility/wcag-audit-2026-06-03.md` (formula-calculated luminance + contrast for every colour-pair fix; full methodology + deferred-pass scope + standards mapping including EN 301 549, UK PSBAR, EAA Directive 2019/882, Section 508). `accessibility.html` updated to v2026.06 — conformance section + "resolved" + "known issues (deferred)" sections rewritten. | Closes the only remaining public-sector procurement blocker. First-pass scope is honest: mechanical fixes done; AT-verified conformance scheduled. Next-quarter pass needs Playwright + a real browser + manual NVDA / VoiceOver runs (not session-tractable). |

| 2026-06-03 | **Gate 6 advanced 2/6 → 3/6 — MSP / IT Admin role track shipped.** `/module-msp-admin.html` is the third role track to ship (after Manager + DPO from v2026.05). Single page, 10 sub-modules per outline at `.audit/course-quality/role-track-outlines/msp-it-admin.md`: (1) Article 4 obligation to own MSP staff, (2) Article 26 obligation to customers' AI systems, (3) one-baseline-many-customers governance pattern, (4) approved-tool inventory schema + monthly change ritual, (5) 30-day customer onboarding sequence, (6) patch + change management for vendor AI updates (model swaps, feature drops, sub-processor changes), (7) audit-pack handover boundary (what MSP owns vs what customer owns), (8) first-10-minute incident response choreography, (9) white-label posture + Schedule D dependency, (10) 10-question self-marked assessment. Single-page HTML, ~700 lines body, JSON-LD `LearningResource` + `BreadcrumbList`, table-of-contents `nav.toc` with 10 anchor jumps. Wired: `course.html` role-tracks grid (now 3 cards, eyebrow + lede updated to "three role tracks"), `msp.html` (hero CTA now points at track + rollout-guide in sequence), `rollout-guide.html` (MSP audience-card cross-links to track), `llms.txt`, `sitemap.xml`. Outline status flipped to SHIPPED. | The MSP-side track was outline-priority #1 ("ship first, lowest content-research cost"). MSP-first commercial motion now has a complete enablement spine: track → rollout guide → 6 templates → SCORM/xAPI packaging. RORtech-equivalents can self-serve onboarding. |

| 2026-06-03 | **Gate 11 closed — 30-day rollout guide shipped.** `/rollout-guide.html` is the dual-audience adoption playbook: internal managers AND MSP partners. Structure = preparation (week 0) + launch (week 1, includes sample sponsor kickoff message) + completion drive (week 2) + assessment & cert (week 3) + embed & handover (week 4). Includes: 7-role responsibility matrix with time-per-week estimates; sample sponsor kickoff message; 7-KPI scoreboard (completion / pass-rate / AUP / register / incidents / time-to-escalate / refresh); 9-row common-pitfalls table; 8-item end-state artefact checklist. Each week has an MSP-variant purple callout (multi-customer cohort cadence, staggered kickoffs, per-customer registers, white-label posture, customer-side sponsor protection). JSON-LD `HowTo` with 5 step IRIs. Wired into `course.html` (callout pre-"How to use this course"), `msp.html` (CTA line under lede), `llms.txt` (new "Rollout" section + lede bump to "6 templates + 30-day rollout guide"), `sitemap.xml`. Procurement-gate state: only gate 6 (role-tracks-build) remains in quarter-one block. | Smallest enabler for MSP-first commercial motion: gives every Founding MSP Partner an out-of-the-box per-customer rollout playbook that produces an audit binder, reducing onboarding friction from "we need to figure this out" to "we run this 4-week plan". |

| 2026-06-10 | **Governance-led content refinement pass (modules 2–5 + shared CSS).** See § Content doctrine — governance-led refinements below for the standing rules. Shipped: five-question test (M2), softened retention + model-training language (M2), enterprise-version justification list (M2), Shadow AI named + defined and threaded through M2/M3 (already in M1/M4), ISO/IEC 42001 "Governance Insight" callout variant (`.callout.govern` in `style.css`) added to M3/M4/M5, Data Classification callout aligned to ISO 27001 (M3/M4), and the legal-accuracy edits to M3 (§1,4,5,6,9) + M4 (Q1/Q3/Q4, vendor due-diligence, AI-wrapper, local-AI) + M5 (not-a-database, hallucination-primary, sanctions phrasing, internal sources, human-oversight wording). Founder-directed. | Moves the course voice from awareness-led to **governance-led**, and removes absolute claims that vary by vendor/product/setting (legal-accuracy + defensibility). Aligns the "what do I paste" decision with data classification — the missing step between M3 and M4. |

| 2026-06-11 | **Terminology rename: "role track(s)" → "Relevant Role(s)"** across all user-facing surfaces: course.html section + eyebrow/lede, page banners + footers on the six track pages, llms.txt, index/pricing/msp/resources/security/standards-map/workshop-deck, changelog.html/.xml/.json, tdm-policy.json, AUP template §11, and DOCTRINE standing sections (gate-6 label, anti-scraping free-page list, strategic TODOs). Historical records intentionally untouched: dated decision-log rows, dated `.audit/` artefacts, and the `.audit/course-quality/role-track-outlines/` directory name remain as written (audit evidence, not live copy). Founder-directed. | Product naming decision; "Relevant Role" better signals to a learner which track applies to them. Records keep the old term because rewriting dated evidence undermines the audit-readiness posture (§ Audit-readiness). |

| 2026-06-11 | **Site-wide visual redesign v3 — "Audit Dossier".** Founder brief: stop looking like every generic AI product; keep the amber-on-dark scheme; keep and enhance the parallax. Shipped via the two shared files so all ~35 v1 pages restyle at once: `assets/style.css` full rewrite (document plates with crop-mark corner ticks replace blur-glass; 2–3px corners replace 14–18px pills; stamped callout icons + classification chips (CAUTION / PRACTICE / PROHIBITED / NOTE / STANDARDS / ISO-IEC-42001); numbered file-tab topbar nav via CSS counters; REF-chip eyebrow with dashed ledger rule; auto clause numbering on `main > h2` (§ 01…); manifest-style objectives; outlined folio numerals on module cards; flat ink shadows, glow removed) and `assets/cinema.js` rewrite (aurora + five orbs deleted; new drafting-field layers: warm wash, two-scale blueprint grid, ledger rules, five giant watermarked clause citations (§4, 42001, Art.26, EU AI Act, ISO 27001 A.5.10); 4-layer scroll parallax at distinct speeds PLUS pointer-depth parallax on fine pointers; reduced-motion fully gated). Companion stylesheets (quiz, widgets, completion, module-video) and inline page styles sharpened to the same corner system. Gate-page 🔒 emoji replaced with inline SVG (closes a no-emoji doctrine violation). Cache busters bumped to ?v=3. Verified: desktop + 375px screenshots on index, course, module-2/3, standards-map; no horizontal overflow; no console errors; parallax layer ratios confirmed. | The old look (gradient aurora + drifting blur orbs + rounded glass) is the exact formula of every 2025-era AI SaaS site; the dossier language is one only an audit-grade governance course can own — the visual design now argues the product's own case. Amber + motion kept per founder; uniqueness gained by changing the language, not the palette. |

| 2026-06-11 | **Typography v4 — Atkinson Hyperlegible across the site (accessibility).** Founder choice from a four-option low-vision specimen review. Display + body: `Atkinson Hyperlegible Next` (fallback `Atkinson Hyperlegible`); mono: `Atkinson Hyperlegible Mono` (replaces Bricolage Grotesque / Manrope / JetBrains Mono on all 45 live v1 pages + inline styles on index gate and cert). Accessibility tuning shipped with it: body 15.4px→17px (line-height 1.75), lede up a step, negative display tracking removed (−0.04em→−0.01em, smaller negatives→0), every mono label tier bumped (~+0.08rem) with reduced tracking, callout/compare/card/check/quiz/widget text sizes raised. Cache buster →?v=4. Verified locally: both families load via document.fonts, plain paragraphs at 17px, no 375px overflow. Scope: v1 live estate only — v2/ drafts and .audit/ records keep old stacks. | Atkinson Hyperlegible is the only family on the shortlist designed for low vision (Braille Institute): unambiguous Il1/O0/B8, mirrored letters differentiated. Aligns the brand with the WCAG 2.2 AA roadmap (gate 8) — the dossier design language (rules, chips, stamps, parallax) carries the distinctiveness so the typeface can carry the legibility. |

| 2026-06-11 | **Palette v5 — "Carbon": amber retired, monochrome silver ink (#c9d4e3) site-wide.** Founder flagged amber-on-dark as Anthropic-adjacent; chose Carbon from a five-scheme specimen review (Blueprint blue, Verdigris green, Archive crimson, Phosphor chartreuse, Carbon). Mapping: accent #e8a726→#c9d4e3, accent-2 #f0c66c→#e6edf6, all rgba(232,167,38,·) literals→rgba(201,212,227,·), deep-amber washes→slate, print/cream ink #b67700→#46505e. Colour now reserved for signals: PRACTICE green and CAUTION/PROHIBITED red keep their hue; NOTE/STANDARDS/GOVERN chips become silver ink; sector overlays keep blue as category marker. Certificate re-set as monochrome document (cream→neutral white/grey, brown sub-text→slate). Swept: style/quiz/widgets/completion CSS + quiz/widgets JS + 48 site HTML files incl. gate + templates; cache busters →v5/v2. Out of scope: v2/ drafts, .audit/ records, og-card.png (still amber — regeneration pending). | De-identifies the brand from Anthropic (and every AI-vendor palette) without inventing a new colour to defend; monochrome restraint is itself the differentiator and suits the dossier language. Signal colours gain meaning when they are the only colour on the page. |

| 2026-06-11 | **Carbon amendment — "Spectra" chromatic background light.** Founder-directed. The Carbon rule splits into INK vs LIGHT: ink (text, chrome, chips, borders) stays monochrome silver and signal colours keep their meaning; background LIGHT may be chromatic. Implemented in the drafting field: wash layer now carries three desaturated spectral tints (teal 79,216,196 · indigo 124,140,255 · bronze 216,162,90) whose **hue rotates with scroll position** (~3°/100px, driven in cinema.js on the isolated blurred layer only); shade parallax bands tinted teal/indigo; pointer sheen gains a faint spectral rim. All gated behind prefers-reduced-motion; text contrast unaffected (tints ≤13% alpha under 34px blur). Cache busters style v8 / cinema v6. | "Colourful" without surrendering the dossier: ambient light through archive glass, not gradient-blob branding. Scroll-coupled hue gives the motion a cause (depth in the document = changing light) rather than decoration on a loop. |

| 2026-06-11 | **Palette v7 — "Periwinkle Blueprint" structural accent; heading emphasis de-coloured.** Founder choice from a four-scheme subtle-accent review (Jade, Periwinkle, Brass, Duotone). Accent #91a2ff / #b9c4ff (8.6:1 on bg) applied to structure only: REF/eyebrow chips, § clause numbers, file tabs, lede rules, list markers, manifest numerals, informational callout chips (NOTE/STANDARDS/GOVERN), tags, hover/focus states, quiz/widget chrome. Explicitly excluded: body text (silver), heading `em` highlights (REMOVED site-wide — h1/gate/cert emphasis now inherits; the shine animation deleted), module-banner SVG line-art (stays silver ink), cert plate (stays monochrome paper), background drawing layers (grid/rules/watermarks/sheen stay silver; Spectra light unchanged). Cache busters style v9 / companions v3. | Subtle colour returns as *structure*, harmonising with the indigo of the Spectra light. Coloured words inside headings made no semantic sense (founder: "it makes no sense that these are coloured") — emphasis in a dossier is typographic, not chromatic. |

| 2026-06-11 | **Light mode ("Paper") + pill theme toggle shipped site-wide.** Dark stays the brand default. `html[data-theme="light"]` token set: paper #eef0f4, ink #141b26, periwinkle-ink #4759c7 (5.7:1), darkened signals (#0e7d49 / #b92d2d), light plates + soft shadows. Drafting field becomes paper: ink grid/rules, dark watermark strokes, pointer sheen flips to multiply (a shadow chasing the cursor), paper vignette; banner SVGs inverted via filter (hue-rotate preserves signal colours). Pill toggle (border-radius 999px — deliberate pill exception to the sharp-corner system) injected into topbar/gate-header by cinema.js: role=switch, aria-checked/-label, sun/moon SVGs, knob 180ms ease-out, updates theme-color meta, persists to localStorage `aisw-theme`; 3-line no-FOUC script in every page head. 24 pages' inline dark-surface literals converted to var(--plate) so they theme. Companion CSS (quiz/widgets/completion) got light blocks. Cache busters style v10 / cinema v7. | Light mode is an accessibility feature (astigmatism/bright-environment readers) and a procurement nicety (print-adjacent reading). Dark remains default: the dossier brand. |

| 2026-06-15 | **Legal-accuracy content pass (M6–M12) + M2 video transitions + award-track perf foundation.** Founder review for legal defensibility. M6: EU AI Act Art 50 reframed (transparency applies in specific circumstances, does not prevent criminal misuse). M8: copyright softened ("may not qualify" / "high risk" / varies by jurisdiction), ownership≠authorship≠copyright, search-engine claim → quality/originality, trademark + trade-dress note, provenance gov-box. M9: GDPR Art 22 "right to explanation" softened to protections for certain automated decisions + Arts 13–15 transparency (heading/objective/meta all updated), ISO 27001 reworded, Outcome/Status log field (8→9), regulatory/audit significance test, RoPA (Art 30) introduced earlier, accountability stays with org/decision-maker, logging-not-surveillance gov-box. M10: "potential 72-hour breach notification requirement" precision, unapproved-tool wording, window runs continuously, downstream-impact, use existing cyber-IR process, DPA/contract/supplier review, "Current impact" incident-note field, response-not-blame gov-box. M12 (= founder's "Module 11"; on-screen M11 is the print checklist): overlap-not-contradict, regulatory penalties not criminal liability, Art 22 scope, Art 50 + limited-risk softened, Annex A "areas such as", one-framework gov-box, Cyber Essentials / NCSC ref. Quizzes realigned. **M2 video**: new spoken `02b-versions-intro` scene (ElevenLabs voice lUTamkMw7gOzZbFIwmq4) + per-scene tail map (~1.1s holds before versions / "Trained on" / takeaway); re-rendered 4:14, embed ?v=2. **Perf (award-track, in-doctrine)**: self-hosted Atkinson (4 woff2 ~81KB under assets/fonts/ + atkinson.css, font-display swap, preload) replacing render-blocking Google Fonts on all 52 pages; `color-scheme: dark light` meta site-wide. Spec at `specs/module-refinements-and-m2-video.md`. | Overstated legal claims are a credibility/liability risk with the DPO/procurement audience the wedge targets. Self-hosting fonts removes two external origins + a render-blocking request (LCP/CLS/CWV win) — first move of a craft+technical+editorial "award-winning" pass, strictly within doctrine. |

| 2026-06-30 | **Visual rebrand v9 — "Sentinel": light-first Palo Alto idiom replaces the periwinkle/carbon Audit Dossier.** Founder brief: understand paloaltonetworks.com and match its tone/style; keep Atkinson. `assets/style.css` rewritten (same class names → all ~40 pages inherit at once): white canvas, charcoal hero/feature bands, rationed orange #fa582d (`-d` #e2491f hover), soft 12px cards with gentle hover lift, soft enterprise shadows, pill buttons (6px). Retired the dossier chrome — crop-mark corners, § clause numbering on `main>h2`, REF-chip eyebrows, blueprint/ledger/watermark parallax (`.cinema-bg` hidden), paper grain. `index.html` hero rebuilt as a full-bleed charcoal band + 4-stat strip + clean light cards. **Theme model INVERTED**: light is now the default, dark is opt-in via `html[data-theme="dark"]`; `cinema.js` toggle + the per-page inline anti-FOUC script (65 files) now set/read `"dark"` (was `"light"`). `module-banner svg` CSS-inverted for the light canvas; `theme-color` meta → #ffffff on shared-shell pages. Cache busters style v14 / cinema v9. Slide decks (sales/workshop/msp-client) keep their own self-contained dark palette. Out of scope (still old branding): og-card.png regeneration. Pushed live, commit `b75ff8b`. | The carbon/periwinkle dossier was distinctive but read as technical/internal; the founder wants the enterprise-security register of the category leader (Palo Alto) for the procurement/DPO buyer. Light-first + rationed orange + airy whitespace says "trusted security vendor"; Atkinson retained so the legibility commitment survives the restyle. |

Append below as decisions land. Use `/aos-log` for global cross-project decisions.

---
| 2026-07-14 | **Nav + homepage restructure (CyberSmart-aligned) and card imagery.** Top nav on all 72 pages rebuilt to the CyberSmart pattern: Products / Frameworks / Business Types / Resources / Plans + pill buttons Sign in (solid) · Book a Demo (outline) · Become a Partner (green). Homepage: hero copy re-set ("Attest AI helps organisations adopt AI safely, securely and responsibly…"), Who-is-this-for band (SMEs / mid-market / growing / regulated / public-sector suppliers), commercial model raised above features, then Meet-Attest-AI, Platform-features, AI-Governance-Services and Why-choose sections all removed as duplicates; How-Attest-AI-helps is the single 4-card grid (AI Safe@Work course / Attest AI Plus Pack / Attest AI Platform → portal / AI Governance Services). FAQ moved off the homepage to `faq.html` (FAQPage JSON-LD moved with it; card added on Resources; footer FAQs links rewired). Every card and page got hero-art banners + 54px round icons: 25 images generated via Higgsfield GPT Image 2 (templates, course modules, changelog/citations/standards-map) + user-supplied Meta AI images (team, manual, charter, ToR, RACI, objectives, AUP), all watermark-cropped and optimised. Em dashes swept site-wide twice (final pass 71 files: spaced→comma, unspaced→hyphen). | Buyer-facing IA copied from the category's best converting SME security site; one commercial story instead of three overlapping section stacks; imagery makes the template library legible at a glance. |
| 2026-07-16 | **Tier model + Tier 1 paywall + checkout.** Tiers locked as: **Tier 1 = AI Safe@Work training + full Plus Pack, £1,000 one-off** (course informational page unlinked from content; purchase CTA + "View our solutions"); **Tier 2 = Attest AI Platform** (monthly subscription, price NOT yet set — open decision); **Tier 3 = consultancy** (unchanged). Swept through pricing (T2 card rebuilt as Platform), FAQ, terms ("12 modules stay free" claim removed), llms.txt, plus-pack meta, consultancy nav. Paywall = `assets/course-gate.js` on modules 1–12, cert, all 27 templates, and (2026-07-19) glossary, standards-map, 6 role tracks, 3 sector overlays and resources.html itself; v2 gate rejects the demo account so AUTH_DISABLED preview no longer bypasses the wall. `checkout.html` = order-request Netlify form `tier1-order` (payment seam: invoice manually — no card processing); `solutions.html` = Tier 2 + services; `checkout-thanks.html`. Contact page: General Contact replaced with Buy Tier 1; Partner Enquiries is now Netlify form `partner-enquiry` (name/email/company) — **user action: set Netlify email notifications to James@attest-ai.com** (no form on the site emails anyone yet). | Converts the free-course wedge into a priced product with a working order path while payments stay human-only; single tier story everywhere a buyer or crawler looks. |
| 2026-07-18 | **Manager portal v2 = full in-portal compliance platform (artifact port, Playwright spec/build/review loop).** `/portal/manager.html` rebuilt as a fixed-viewport app shell replicating the published artifact exactly (white/orange, Atkinson): grouped numbered sidebar + 11 interactive sections — Dashboard (live KPIs), 01 AUP (editable fields, generated document, publish-to-staff, acks), 02 Use Case Register, 04 Risk Register (likelihood×impact auto-rating), 03 Assessments, 08 Vendor DD (19-question scored checklist), 09 Supplier Risk Score, 05 Incidents, 06 RACI (editable), 07 ToR, 10 Staff & Sign-off — plus a Manage group preserving Team invites/completion-CSV, Course, Templates, Updates. Artifact source obtained via claude.ai's public `published_artifacts` API (Playwright on claude.ai itself is Turnstile-blocked; not bypassed). Data layer: new Supabase table `governance_state` (per-manager KV JSONB, RLS `gs_owner_all`) replacing the artifact's sandbox storage; localStorage fallback. Method: Playwright walked all 11 artifact sections → `specs/manager-dashboard.md` → build → two review rounds to zero gaps/zero errors; tests banked as `tests/manager-dashboard.{structure,crud}.mjs` (FT-AIMP-01/02 in the coverage doc). Theme toggle (shared cinema.js control) top-right + full dark-theme overrides, contrast-checked on every section. | The portal now IS the Tier 2 product: the artifact's UX with real auth, real persistence and the existing team machinery — and the spec+tests make it regression-checkable. |
| 2026-07-19 | **CSP inline-handler fix (site-wide latent bug).** The production CSP (`script-src 'self'`) silently blocks inline `onclick=` — the ported dashboard's buttons (AUP header, register cards, doc-pack Opens, modal save/delete) were dead on live while passing local tests. Fixed CSP-properly, not by weakening the policy: generated HTML now uses `data-act`/`data-a1`/`data-a2` + one delegated dispatcher in `aimp.js`; discovered the same CSP had been killing **31 static Print/Save-PDF buttons** across templates/guides since launch — fixed via a `.print-btn` click delegation in shared `cinema.js` (v13). Verified with a Playwright run that injects the exact production CSP locally (5/5) then re-tested live. **Known-broken remainder**: internal slide decks (sales-deck / workshop-deck / msp-client-deck) use inline `<script>` blocks the CSP also blocks — their prev/next controls are dead on live; fix when the decks are next needed. **Rule for the skill file: any generated or static HTML on this site must not use inline handlers or inline scripts — CSP blocks them only in production, so local tests pass and live breaks.** | A fix that failed twice (worked local, dead live) is a missing rule; now recorded. Print buttons were a silent conversion/credibility hole in the audit-pack story. |
| 2026-07-19 | **Commercial model snapshot + open pricing decisions.** ARR today £0 (nothing sold; checkout is an order form). Structure after the tier lock: T1 £1,000 one-off = cash flow not ARR; **T2 Platform subscription = the direct ARR engine, price unset**; MSP channel (£499/£1,499/£3–5k mo, locked 2026-05-19) = strongest ARR lever, now with a real product behind the white-label claim. Scenario ARR (assumption ~£149/mo direct): Y1 exit £12k–£66k–£190k (conservative/central/ambitious); Y3 solo £300–600k. Market sizing (GOV.UK BPE 2025; DSIT MSP study 2025): UK 1.4M employer businesses, 12,867 MSPs → TAM ~£2.5bn +£80–230M MSP; SAM ~£500M direct + ~£15M MSP; SOM 0.01–0.1% of SAM. **ChatGPT restructure proposal assessed**: adopt-worthy — product names over tier numbers, Safe@Work as £99/user/yr recurring, "every Platform subscription includes Safe@Work" framing, and a downloadable-essentials vs live-platform content split (fixes T1-includes-everything undercutting T2); weak spots — per-user platform pricing for org-level features (prefer org base fee + per-user training) and no MSP 70/30 reconciliation. **Open decisions (founder)**: T2 price; whether to adopt per-user model; MSP reconciliation maths; flip AUTH_DISABLED + rotate demo before real buyers (paywall + portal now both depend on it); Netlify form email notifications. | The numbers now live in the doctrine, not a chat transcript; every open money decision is named with its blocker. |

## § Content doctrine — governance-led refinements (added 2026-06-10)

> Standing content rules from the founder's 2026-06-10 review. These bind every
> module rewrite (modules 4–12 still pending the plain-English pass) and any
> translation. Position: **governance-led, not awareness-led.** The course
> teaches people to make a governed decision, not just to be careful.

### Terminology: "Relevant Role", not "role track" (added 2026-06-11)

The course category formerly called *role tracks* is **Relevant Roles**
(singular: **Relevant Role**) in all user-facing copy: banners, course.html,
llms.txt, pricing, feeds, templates, new modules, translations. Do not
reintroduce "role track". Historical records (dated decision-log rows, dated
`.audit/` artefacts, the `role-track-outlines/` directory name) keep the old
term as written — they are evidence, not live copy.

### The five-question test (was four)

The pre-paste test in Module 2 keeps its four tool-interrogation questions and
adds a fifth, asked **first in spirit** because it is the real decision point in
most organisations:

**"What type of data am I about to paste?"** — Public · Internal · Confidential ·
Personal · Special category.

Classification drives the answer to everything that follows. Keep the original
four (where kept · how long · used to train · who can read).

### Shadow AI — named, defined, repeated

"Shadow AI" is a **named, recurring term** across the course (not a one-off).
Canonical definition to reuse:

> When employees use AI tools outside approved company processes, this is often
> referred to as **Shadow AI**. Shadow AI reduces visibility, increases risk and
> makes governance significantly more difficult.

Thread it wherever unapproved/free/personal tool use appears (M1, M2, M3, M4 at
minimum; glossary entry already exists).

### ISO 42001 Governance Insight boxes

Reusable callout variant `.callout.govern` ("Governance Insight"). Standing copy:

> **ISO/IEC 42001** encourages organisations to understand the AI systems they
> use, assess supplier risks and implement appropriate controls over
> AI-related activities.

Use it to position governance points (suppliers, data handling, controls, human
oversight) as framework-backed, not opinion. Human oversight specifically is
"one of the core principles found across ISO 42001, the EU AI Act and many
emerging AI governance frameworks."

### Soften absolutes — retention + model training

Vendor/product/setting variance must not be stated as universal fact. Approved
replacements:

- ~~"Chats are usually kept for at least 30 days, often longer, even after you
  delete them."~~ → **"Retention periods vary between vendors, products and
  settings. Some providers may retain data for a period after deletion for
  operational, legal or security purposes."**
- ~~"Your chats may be used to train the next AI."~~ → **"Depending on the
  provider and your settings, conversations may be used to improve future
  models, services or safety systems."**

### Enterprise version — justify the buy

Where the enterprise tier is covered, state **why organisations buy it**:
administrative control · data governance · identity integration · auditability ·
compliance requirements. This justifies the spend rather than just listing
features.

### Legal-accuracy refinements (standing)

- "data breach by itself" → "may result in a **personal data breach or
  unauthorised disclosure**".
- Code: "may stop counting as a secret at all" → "may **reduce legal and
  commercial protections around confidential information**".
- "Inside information" applies to **publicly traded companies in specific
  circumstances** — do not imply it covers all private financial data.
- Secrets pasted into a chat → "should be treated as **potentially
  compromised**" (not "no longer a secret").
- Client information → reference **contractual confidentiality obligations**,
  often a bigger issue than data protection.
- **Data Classification** callout (Public · Internal · Confidential · Restricted),
  aligned to ISO/IEC 27001 — reinforces governance principles.
- LLMs: "does not look things up" → "**does not automatically look things up
  unless connected to external tools or search services**". Hallucinations can
  still occur with external data sources, though the risk is generally reduced.
- **"Hallucination" stays the primary term** (most recognised); "confabulation"
  is the more precise secondary term, not the headline.
- Avoid unsourced specifics (e.g. "sanctions in at least four countries") →
  "**sanctions, court criticism and professional embarrassment in multiple
  jurisdictions**".
- Verification sources include **company policy, internal procedures and
  contractual obligations** where applicable — not only external sources.
- Human oversight wording tracks the regulation: "**Appropriate human oversight
  should be applied before AI-generated outputs are relied upon in decisions
  affecting individuals.**"

---

## § Course content v2 — 11-module governance refresh (added 2026-05-31)

> Source: `AI_SafeAtWork_Course_Content_v1_Word.docx` authored by the founder, dropped 2026-05-31. Captured verbatim in `.audit/course-quality/v2-content-source-2026-05-31.txt`. This section locks the v2 product direction; v1 (the 12-module shipped course w/ 120 MCQs + 8 widgets + cert at <https://aisafework.netlify.app/>) remains live and is the v1 reference build.

### Status note from the founder

> "Treat this as the current working content rather than final copy. I've evolved the course structure from the original concept and currently have 11 core modules focused on AI governance, safe AI adoption and operational risk. The content will continue to be refined as we see it come to life in the platform, so I'd rather focus on getting the user journey, layout and experience right than polishing every word at this stage. The platform should be flexible enough to add, remove or reorder modules later if needed."

### MVP scope direction (v2, 2026-05-31)

| Layer | In MVP | Defer |
|---|---|---|
| Landing | Clean landing page | — |
| Overview | Course overview | — |
| Navigation | Module navigation | — |
| Progress | Progress tracking | — |
| Device | Mobile-friendly design | — |
| Assessment | Ability to add later | Live assessments + scoring |
| Cert | Ability to add later | Live certification |
| Flexibility | Add / remove / reorder modules | — |

**Founder ask:** "Let's get a first version in front of us and iterate from there. I think we've got enough content now to prove the concept, and seeing it live will help shape the next phase."

### Roadmap (post-MVP, per founder)

- Manager and leadership tracks
- Compliance / DPO tracks
- Knowledge checks and scoring
- Certification
- Governance templates
- Standards mapping (ISO 42001, EU AI Act etc.)
- MSP white-labelling
- Governance packs and consultancy services

### Map: v1 (shipped) → v2 (this doctrine)

| v2 # | v2 title | v1 source | Change |
|---|---|---|---|
| 1 | Why AI Governance Matters | v1-M1 (Why this course exists) | Refocused on governance / shadow AI / operational risk vs prior "three incidents" hook |
| 2 | What AI Tools Actually Do With What You Type | v1-M2 (verbatim title) | Same shape · adds Red/Amber/Green exercise |
| 3 | The Never-Paste List | v1-M3 (verbatim title) | Same structure · adds Red/Amber/Green |
| 4 | Picking The Right Tool For The Job | v1-M4 (verbatim title) | Adds AI Tool Categories breakdown + Decision Tree |
| 5 | Verifying What The AI Tells You | v1-M5 (verbatim title) | Adds 4-rule Verification Workflow |
| 6 | AI-Powered Scams Aimed At You | v1-M6 (verbatim title) | Adds 4-rule Verification Rules |
| 7 | Bias, Fairness, And Not Embarrassing The Business | v1-M7 (verbatim title) | Adds 4 Practical Safeguards |
| 8 | Logging, Accountability, And Auditability | v1-M9 (Logging and accountability) | Renumbered · drops EU-Act-only framing for org-neutral language |
| 9 | AI Incidents, Escalation, And What To Do When Something Goes Wrong | v1-M10 (When something goes wrong) | Renumbered · widens to all incident classes |
| 10 | The 60-Second AI Safety Checklist | v1-M11 (60-second pre-submit checklist) | Renumbered · adds 6-question framework |
| 11 | Final Assessment & AI Safe@Work Certification | NEW (v1 had no in-course final assessment) | New module · 5 scenario Qs + 3 judgement Qs + cert outcome |
| — | DROPPED | v1-M8 (Copyright, IP) | Not in v2 scope · defer to advisory layer |
| — | DROPPED | v1-M12 (Standards behind this course) | Standards stay cited inline · own module removed |

### Editorial shift v1 → v2

- **Audience framing:** v1 = "non-tech SMB staff, EU-first." v2 = "organisations adopting AI safely, governance-led, operationally framed."
- **Shadow AI promoted to core concept.** v1 mentioned in M4 callout. v2 = headline thread across M1, M2, M4, M8, M9.
- **Red/Amber/Green pattern added to every module.** v1 = compare-cells (good/bad). v2 = three-tier RAG exercise structure.
- **Tone:** v1 = "stop being the weakest link" energetic personal. v2 = "operational governance maturity" institutional.
- **Standards:** v1 = inline-cited (Article 4, Annex A.5.10 etc.). v2 = standards-agnostic body language · standards-mapping deferred to roadmap layer.
- **Final assessment:** v1 = printable checklist as final module. v2 = scenario-based assessment + certification at M11.

### Full v2 module content (verbatim from source doc)

---

### MODULE 01 — Why AI Governance Matters

**Duration:** 7–10 minutes

**Learning outcomes — by the end of this module, learners will:**

- understand why organisations are introducing AI governance
- recognise operational risks linked to unmanaged AI usage
- understand what "shadow AI" means
- identify how everyday AI usage can create business exposure

**Introduction — AI is already inside many organisations.** Employees are increasingly using tools such as ChatGPT, Microsoft Copilot, Google Gemini, Claude, AI browser extensions, transcription tools and AI-enabled SaaS platforms to write emails, summarise meetings, analyse information, create content and improve productivity. In many cases, this adoption happens faster than governance, training, approval processes or operational oversight. This is commonly referred to as **Shadow AI** — use of AI systems outside approved governance, procurement or security processes.

**Why this matters.** AI can provide significant business benefits. Unmanaged AI usage may also create confidential data exposure, GDPR/privacy concerns, intellectual property risks, inaccurate outputs, reputational damage, supplier governance issues, and operational risk. This course helps employees use AI more safely, recognise governance boundaries, reduce operational risk, and support responsible AI adoption.

**Real-world scenario 1 — "It was only for five minutes."** A sales employee uploads a customer pricing proposal into a public AI chatbot to "improve the wording before a meeting." Document includes customer names, pricing information, commercially sensitive details. Employee assumes "it's harmless and temporary." Risks created: confidentiality exposure, contractual concerns, customer trust issues, potential third-party retention, governance failures. **Key lesson:** Even well-intentioned AI usage may create business risk if employees do not understand where information goes, what the platform retains, and whether the tool is approved.

**Real-world scenario 2 — "The AI sounded confident."** A manager uses AI to summarise new employment legislation before updating internal policy. Output appears professional, includes fabricated references, contains inaccurate legal guidance. Manager assumes "it looked correct." Risks: misinformation, poor operational decisions, compliance concerns, reputational damage. **Key lesson:** Generative AI systems generate outputs based on learned patterns and probabilities rather than verified factual reasoning. Human oversight remains essential.

**Real-world scenario 3 — "Nobody realised the plugin was using AI."** A browser extension used by marketing automatically sends webpage content to a third-party AI service for summarisation. No governance review. No one understands what data is processed, where it is stored, or whether the vendor uses submitted data for training. Risks: shadow AI usage, supplier governance failures, privacy concerns, unknown third-party processing. **Key lesson:** AI functionality increasingly exists inside browsers, productivity tools, SaaS platforms, and collaboration software. Employees may use AI-enabled services without fully realising it.

**The goal of this course.** Not designed to prevent innovation, discourage productivity, or block responsible AI usage. The objective is to help organisations adopt AI safely, improve operational governance, reduce avoidable risk, and establish responsible AI usage practices.

**Quick knowledge check — examples of "shadow AI" (all of the above):** Using an unapproved AI chatbot for work; installing an AI browser extension without approval; uploading company information into a personal AI account; using AI-enabled SaaS tools without governance review.

**Key takeaways:** AI usage is becoming widespread across organisations · unmanaged AI usage may create operational and governance risks · AI governance supports safe adoption rather than blocking innovation · human oversight remains essential · every employee has a role in responsible AI usage.

---

### MODULE 02 — What AI Tools Actually Do With What You Type

**Duration:** 8–12 minutes

**Learning outcomes:** understand how generative AI systems process information · recognise the difference between consumer and enterprise AI tools · understand why some data should not be entered into unapproved AI systems · identify common misunderstandings around AI privacy and retention.

**AI tools are not simply search engines.** When information is entered into an AI system, it may be processed, transmitted, retained, logged or reviewed depending on the provider, account type, organisational controls and platform settings. Different AI platforms operate in different ways.

**What happens when you type into AI?** (1) Information is transmitted to the AI provider. (2) The system processes the request using a large language model. (3) A response is generated. (4) Data handling depends on the platform, governance settings, contractual protections and organisational controls. Some AI systems may retain or process submitted data depending on platform configuration, enterprise settings and account type.

**Consumer / Free AI tools.** Examples: free ChatGPT · personal Claude accounts · public Gemini apps · AI browser plugins · unapproved AI SaaS tools. Potential risks: limited governance controls · unclear retention practices · personal account ownership · limited organisational oversight · uncertain data residency. These tools should not be used for confidential company information, regulated data, customer records, source code, or commercially sensitive material unless explicitly approved.

**Enterprise AI platforms.** Examples: ChatGPT Enterprise · Microsoft Copilot for M365 · approved enterprise AI environments. May provide stronger governance controls, administrative oversight, auditability, contractual protections and improved compliance alignment. However: organisations remain responsible for configuration, governance and oversight. Enterprise AI does not remove hallucination risk, human error, oversharing or governance failures.

**Real-world scenario — "It was only meeting notes."** Project manager uploads internal meeting notes (customer names, staffing discussions, commercially sensitive information) into a public AI chatbot to "summarise action points." Assumes "nobody will see it." Risks: confidentiality concerns, customer trust, supplier governance exposure, operational governance failures. **Key lesson:** Information entered into unapproved AI systems may create unnecessary organisational risk.

**Common misunderstandings.** (a) "The AI forgets immediately" — not necessarily; some systems retain prompts, logs or conversation history depending on settings, account type and platform configuration. (b) "Deleting a chat removes all data" — not always; removing a conversation from the UI does not necessarily mean immediate or backend deletion. (c) "Popular AI tools must be safe" — popularity does not equal governance approval. (d) "Enterprise AI removes all risk" — incorrect; organisations still remain responsible for oversight, permissions, configuration and safe usage.

**Red / Amber / Green exercise.** GREEN (lower risk): brainstorming · grammar improvements · generic drafting · non-sensitive summarisation. AMBER (requires governance & oversight): internal business information · customer communications · operational reporting · supplier discussions. RED (do not enter into unapproved AI): customer personal data · passwords · contracts · pricing models · HR information · source code · regulated data · security configurations.

**Practical workplace rule — before entering information into AI, ask:** (1) Is this tool approved for business use? (2) Does this contain customer data, confidential information, contracts, HR information, pricing, or intellectual property? (3) Would the organisation expect this information to be processed externally? If unsure: stop and ask before proceeding.

**Key takeaways:** AI platforms process information differently · consumer AI tools generally create higher governance risk · enterprise AI may provide stronger controls but still requires oversight · shadow AI is becoming a significant operational challenge · human judgement and governance remain essential.

---

### MODULE 03 — The Never-Paste List

**Duration:** 8–10 minutes

**Learning outcomes:** understand which information should not be entered into unapproved AI systems · recognise high-risk business data · understand why even small snippets of information may create exposure · apply safer decision-making before using AI tools.

**Most AI-related incidents begin with convenience.** Someone wanted to save time, improve wording, summarise information, or work more efficiently. The issue is often not malicious intent. The issue is misunderstanding what information is sensitive, misunderstanding how AI tools process data, or using unapproved platforms without governance.

**The golden rule.** If information is confidential, commercially sensitive, regulated, personal or security-related, do not assume it is safe to enter into AI tools, especially consumer AI platforms, free AI accounts, browser extensions or unapproved SaaS tools. Only use approved enterprise AI platforms for permitted organisational data classifications.

**1. Customer personal data.** Names · addresses · phone numbers · email addresses · payroll details · identification numbers · medical information · customer tickets · CVs · account information. May create GDPR/privacy concerns, customer trust issues, regulatory exposure, governance risk. *Scenario — "It was just a customer complaint":* support employee pastes customer complaint email (containing names, account details, personal information) into a public AI chatbot to generate a more professional response. Risks: personal data exposure, customer trust concerns, governance failures, potential privacy breaches.

**2. Confidential business information.** Pricing models · commercial proposals · supplier negotiations · acquisition discussions · internal strategy · financial reporting · sales forecasts · commercial agreements. May create competitive exposure, contractual risk, reputational harm, governance concerns. *Scenario — "The AI improved the proposal":* salesperson uploads draft proposal containing customer pricing, commercial margins and supplier comparisons into a free AI tool to "make it sound more executive." Risks: commercial confidentiality exposure, supplier governance concerns, reputational risk, operational governance failures.

**3. Passwords & security information.** Do not enter: passwords · MFA codes · API keys · VPN details · certificates · firewall configurations · penetration test results · infrastructure diagrams · vulnerability reports. May directly increase cyber security risk, infrastructure exposure, operational vulnerability. *Scenario — "The AI helped troubleshoot the firewall":* IT administrator pastes firewall logs, internal IP ranges and VPN configuration details into an AI chatbot. Risks: infrastructure exposure, attack surface disclosure, governance failures, operational cyber risk.

**4. HR & employment information.** Disciplinary records · salaries · grievances · sickness records · redundancy plans · interview notes · performance reviews · recruitment assessments. May involve privacy obligations, discrimination concerns, legal exposure, employee trust issues. *Scenario — "The AI scored the candidates":* hiring manager uploads CVs, interview notes and candidate rankings into an AI tool to "speed up shortlisting." Risks: discrimination concerns, privacy exposure, governance failures, reputational harm.

**5. Intellectual property & source code.** Source code · engineering drawings · product designs · proprietary methods · unreleased content · internal documentation · customer deliverables. May expose trade secrets, commercially valuable IP, or sensitive technical information. *Scenario — "The AI fixed the code":* developer pastes proprietary source code (authentication logic, customer integrations, internal security controls) into a public AI assistant to debug a performance issue. Risks: intellectual property exposure, security concerns, supplier governance issues, contractual risk.

**The "small snippet" problem.** Many employees assume "it's only a small amount of information." However: fragments of information may still be sensitive · multiple prompts may create larger exposure · context may reveal more than expected. Examples: partial pricing, project references, screenshots, internal acronyms, snippets of contracts, customer references. Even incomplete information may still create risk.

**Red / Amber / Green exercise.** GREEN: brainstorming ideas · rewriting public content · grammar improvements · generic learning support. AMBER (requires approved enterprise AI & oversight): internal discussions · supplier communications · operational summaries · customer-related content. RED (do not enter into unapproved AI): customer personal data · passwords · source code · contracts · pricing · HR information · regulated data · security configurations.

**Practical workplace rule.** (1) Is this information confidential or commercially sensitive? (2) Does it belong to a customer, employee, supplier or partner? (3) Is the AI platform approved for this type of information? (4) Would the organisation expect this information to be processed externally? If unsure: stop and escalate before proceeding.

**Key takeaways:** Most AI-related risk comes from oversharing information · confidential information includes more than passwords and personal data · commercial information may be highly sensitive · small snippets of information may still create exposure · governance and human judgement remain essential.

---

### MODULE 04 — Picking The Right Tool For The Job

**Duration:** 8–12 minutes

**Learning outcomes:** understand that different AI tools carry different levels of risk · recognise when enterprise-approved tools should be used · identify unsafe or unapproved AI usage · make safer decisions when selecting AI tools for work.

**Not all AI tools operate in the same way.** Some AI platforms are designed with enterprise governance, security controls, auditability and organisational management in mind. Others are consumer-focused, lightly governed, or completely outside organisational oversight. One of the largest operational AI risks facing organisations today is using the wrong AI tool for the wrong task.

**The core principle.** The more sensitive the task, the stronger the governance requirement. Tool selection should not be based only on convenience, popularity or speed. It should also consider governance, data sensitivity, organisational approval and operational accountability.

**1. Consumer AI tools.** Examples: free ChatGPT · personal Claude accounts · public Gemini apps · AI browser extensions · consumer AI writing assistants. Typical use cases: brainstorming · generic drafting · low-risk productivity support · public content creation. Typical risks: limited governance controls · personal account ownership · uncertain retention settings · reduced organisational oversight · unknown data residency. Should generally not be used for confidential business information, regulated data, customer information, or commercially sensitive material unless explicitly approved.

*Scenario — "It was quicker on my phone":* manager uses a personal AI app to summarise internal strategy discussions, staffing concerns and financial updates. The organisation provides an approved enterprise AI platform but the employee chooses the personal app because "it was faster." Risks: shadow AI usage, governance bypass, loss of auditability, unmanaged data exposure. **Key lesson:** Convenience should not override governance and approval processes.

**2. Enterprise AI platforms.** Examples: ChatGPT Enterprise · Microsoft Copilot for M365 · approved enterprise AI environments. May provide stronger administrative controls, auditability, retention management, contractual protections and governance tooling. However: organisations still remain responsible for configuration, permissions, oversight and safe usage. Enterprise AI does not remove hallucination risk, human error, oversharing or governance failures.

*Scenario — "Copilot already had access":* employee uses Microsoft Copilot to summarise project documentation, assumes "it must be safe because it's part of Microsoft 365." However SharePoint permissions were poorly managed, historical folders contained sensitive information, Copilot surfaced information more broadly than expected. Risks: oversharing, permissions exposure, governance weaknesses, information leakage. **Key lesson:** Enterprise AI security depends heavily on governance maturity, permissions management and organisational controls.

**3. AI browser extensions & plugins.** Examples: AI writing assistants · browser summarisation tools · AI email plugins · AI note-taking extensions. Common risk: employees may not realise the extension uses AI, information is processed externally, or governance approval has not taken place. *Scenario — "Nobody approved the plugin":* marketing employee installs a browser extension that rewrites customer emails, summarises webpages, drafts social media posts. No vendor review. Extension automatically sends webpage content, customer communications and internal text to external AI services. Risks: supplier governance concerns, third-party exposure, privacy risk, shadow AI growth. **Key lesson:** AI risk increasingly exists inside browser plugins, SaaS integrations and embedded productivity tools, not only standalone AI chatbots.

**Choosing the right tool — before using AI, ask:** (1) Is the tool approved? Use organisation-approved AI tools wherever possible. (2) What type of information is being processed? The more sensitive the information, the stronger the governance requirement. (3) Is this a personal or enterprise-managed account? Personal AI accounts generally create higher operational risk. (4) Is the output business-critical? If outputs affect customers, finance, legal matters, HR or compliance, human oversight becomes essential. (5) Does the tool support governance? Can the organisation manage usage, apply controls or review activity? If not, risk increases significantly.

**Tool-selection decision tree.** LOW-RISK TASK: use approved enterprise AI, generic prompts, non-sensitive information. SENSITIVE BUSINESS INFORMATION: use approved enterprise AI only, minimum necessary information, human oversight. HIGHLY CONFIDENTIAL OR REGULATED DATA: do not use AI unless explicitly approved, operationally governed and authorised by the organisation.

**Red / Amber / Green.** GREEN: approved enterprise AI used for brainstorming · non-sensitive drafting · productivity support · generic summarisation. AMBER: AI used for customer communications · operational reporting · supplier discussions · internal business summaries; requires approved tools, governance controls, human oversight. RED: personal AI accounts used for confidential work · unapproved browser extensions · free AI tools processing sensitive information · unmanaged AI SaaS platforms · AI-generated outputs used without review.

**Key takeaways:** Different AI tools create different levels of risk · convenience should not override governance · enterprise AI may reduce risk but still requires oversight · browser extensions and SaaS integrations may create hidden AI exposure · tool approval and governance are critical operational controls · human oversight remains essential.

---

### MODULE 05 — Verifying What The AI Tells You

**Duration:** 10–12 minutes

**Learning outcomes:** understand why AI systems may generate incorrect information · recognise hallucinations, bias and false confidence · apply practical verification techniques · understand why human oversight remains essential.

**AI can sound convincing while still being incorrect.** This is one of the biggest operational risks associated with generative AI. AI systems are designed to generate human-like responses, predict likely language patterns, and produce helpful outputs quickly. They are not guaranteed sources of truth, legal authorities, compliance specialists or replacements for professional judgement. Generative AI systems generate outputs based on learned patterns and probabilities rather than verified factual reasoning. As a result, AI may fabricate information, generate inaccurate content, misunderstand context, present outdated information, or produce biased outputs. This is commonly referred to as **hallucination**.

**The core principle.** If the output matters, it must be verified by a human. Especially where outputs affect customers, finance, legal matters, compliance, HR, operational decisions or reputational risk.

**What is a hallucination?** A hallucination occurs when an AI system generates fabricated, inaccurate or misleading information while presenting it confidently. Examples: invented references · incorrect statistics · fabricated case law · inaccurate policy guidance. The risk is that the response may still appear highly professional and believable.

*Scenario 1 — "The cases didn't exist":* a lawyer uses AI to help prepare legal arguments. AI generates legal case references, quotations and supporting explanations. Output appears authoritative, sounds professional, includes detailed citations. However the legal cases were fabricated. Risks: reputational damage, operational embarrassment, legal exposure, professional conduct concerns. **Key lesson:** AI-generated confidence is not proof of accuracy.

*Scenario 2 — "The financial summary was wrong":* manager uses AI to summarise financial reporting for leadership meeting. AI misinterprets spreadsheet context, swaps percentages, generates inaccurate conclusions. Manager trusts the output without verification. Risks: inaccurate reporting, poor decision making, governance concerns, operational disruption. **Key lesson:** AI-generated summaries should support human review, not replace it.

*Scenario 3 — "The AI made up the policy":* employee asks AI "what does our company policy say about customer refunds?" AI generates a convincing response using formal language, realistic wording and fabricated policy details. Employee acts on the incorrect guidance. Risks: misinformation, customer disputes, inconsistent decision making, governance failures. **Key lesson:** AI should not replace official documentation, approved policies or authoritative organisational guidance.

**Why AI gets things wrong.** Generative AI systems predict patterns, not verified truth. Outputs are influenced by training data, prompt quality, context and probability-based language generation. AI may misunderstand prompts, combine unrelated information, oversimplify issues, or fill gaps with inaccurate detail.

**Common AI failure types.** (1) Fabricated information ("hallucinations") — fake references, invented statistics, fabricated case law, inaccurate policies. (2) Outdated information — relies on historical training data, misunderstands recent changes, provides outdated guidance. (3) False confidence — presents uncertain information using authoritative tone, professional structure, convincing wording. (4) Bias & context errors — incomplete context, training bias, flawed assumptions, missing information. (5) Oversimplification — removes nuance, exceptions, important operational context. Particularly risky in legal, compliance, HR and financial environments.

**Verification rules.** Rule 1 — verify important outputs (the greater the business impact, the greater the verification requirement). Rule 2 — check trusted sources (verify against official documentation, organisational policy, approved systems, authoritative sources). Rule 3 — challenge the output (does this make sense? is anything missing? does this match official guidance? would I trust this without AI involvement?). Rule 4 — understand AI's role (AI may support drafting, summarisation, brainstorming and productivity; humans remain accountable for decisions, approvals, compliance and operational outcomes).

**Verification workflow — before using AI output:** (1) Check factual accuracy, names, dates, references, calculations, links. (2) Validate business context, organisational policy, legal/compliance implications. (3) Apply human judgement, operational oversight, professional review. (4) Escalate if unsure, customer-impacting, high-risk, or governance-sensitive.

**Red / Amber / Green.** GREEN (lower-risk): brainstorming · grammar improvements · generic drafting · idea generation — still requires review. AMBER (careful verification): customer communications · operational summaries · policy drafts · reporting outputs — requires source validation, human oversight, organisational review. RED (do not rely on without expert validation): legal advice · regulatory interpretation · disciplinary decisions · financial reporting · medical guidance — AI may assist, but qualified humans remain responsible.

**Practical workplace rule.** Treat AI outputs as draft assistance, not final authority. Always apply verification, oversight and professional judgement.

**Key takeaways:** AI systems may generate convincing but inaccurate information · hallucinations are a genuine operational risk · human oversight remains essential · important outputs should always be verified · AI should support judgement, not replace it · accountability remains with the human user and organisation.

---

### MODULE 06 — AI-Powered Scams Aimed At You

**Duration:** 10–12 minutes

**Learning outcomes:** understand how AI is changing cyber crime and social engineering · recognise AI-enhanced phishing, impersonation and fraud · identify common manipulation techniques · apply safer behaviours when handling suspicious communications.

**AI is not only helping businesses.** Attackers increasingly use AI to write convincing phishing emails, imitate writing styles, generate fake documents, automate scams, create realistic impersonation attempts and support social engineering at scale. Scams are becoming more believable, more personalised, and more difficult to identify using traditional warning signs alone. The greatest risk is realistic, convincing and highly targeted deception.

**The new reality.** Historically, phishing messages often contained spelling mistakes, poor grammar, awkward language, or obvious warning signs. AI now allows attackers to generate professional language, realistic tone, contextual messaging and targeted communications quickly and cheaply. This significantly lowers the barrier for cyber crime.

*Scenario 1 — "The CEO asked urgently":* finance employee receives a Teams message appearing to come from a senior executive. Message says "need this payment processed urgently before the meeting. I'm travelling and can't call." Wording sounds natural, references real projects, matches the executive's communication style. The account was compromised; the message formed part of a social engineering attack. AI-assisted techniques may have been used to improve wording, imitate communication style, or personalise the request. Risks: financial fraud, business email compromise, operational disruption, reputational damage. **Key lesson:** Urgency and familiarity should not replace verification and process.

*Scenario 2 — "The voice sounded real":* employee receives a phone call from someone sounding very similar to their manager. Caller requests password resets, MFA approvals, urgent access changes. Employee complies because "it sounded like them." Organisation later suspects the call may have involved AI-generated voice impersonation. Risks: credential compromise, account takeover, operational security failures, major incident escalation. **Key lesson:** Voice and video should no longer be treated as standalone proof of identity. Verification processes remain essential.

*Scenario 3 — "The phishing email looked perfect":* staff member receives email appearing to come from a supplier. Message contains accurate branding, references real projects, uses highly professional language. Employee clicks the link because "it looked legitimate." Site captures login credentials. Risks: account compromise, supplier impersonation, operational disruption, potential ransomware exposure. **Key lesson:** Professional language and branding do not guarantee legitimacy.

**Common AI-enhanced threats.** (1) AI-generated phishing emails — personalise emails, imitate writing styles, improve language quality, generate convincing communications rapidly. (2) Voice impersonation — attackers use AI-assisted tooling to generate realistic voice impersonations using publicly available audio, social media clips, meeting recordings, voicemail samples. (3) Deepfake video — impersonate executives, support fraud attempts, create fake meetings, manipulate trust. (4) Fake documents & content — convincing but inaccurate or fabricated invoices, contracts, reports, policies, customer communications. (5) AI-assisted social engineering — research organisations, profile employees, craft believable messages, automate deception at scale.

**Why humans are still the target.** Even with advanced technology, most attacks still succeed because someone trusts the request, bypasses process or acts under pressure. AI increases realism. Human judgement and operational controls remain critical defences.

**Warning signs still matter.** Even AI-enhanced scams often rely on urgency, emotional pressure, secrecy, authority, or requests to bypass process. "Do this urgently." "Don't tell anyone yet." "I need this immediately." "You're the only person available." These should always trigger caution.

**Verification rules.** Rule 1 — slow down (urgency is a common manipulation tactic). Rule 2 — verify through another channel (call directly, message separately, use approved contact methods; do not rely solely on incoming email, voice or video). Rule 3 — follow process (do not bypass approval workflows, MFA controls, payment verification, identity checks because a request appears urgent or senior). Rule 4 — escalate suspicious activity.

**Red / Amber / Green.** GREEN: independently verifying requests · following approval processes · reporting suspicious communications · slowing down under pressure. AMBER (requires additional verification): urgent executive requests · supplier payment changes · unexpected MFA prompts · unusual file-sharing requests. RED (high-risk): sharing passwords · approving MFA requests without verification · bypassing controls due to urgency · trusting voice/video automatically · processing payments without following process.

**Practical workplace rule.** Treat urgent requests, unusual behaviour, payment changes, MFA prompts and identity-based requests with caution. AI-assisted attacks increase realism. Verification protects the organisation.

**Key takeaways:** AI is making scams more convincing and scalable · professional language does not prove legitimacy · voice and video impersonation risks are increasing · human judgement and process remain critical controls · verification and escalation are essential operational behaviours · slowing down reduces risk.

---

### MODULE 07 — Bias, Fairness, And Not Embarrassing The Business

**Duration:** 9–12 minutes

**Learning outcomes:** understand how AI systems may produce biased or inappropriate outputs · recognise reputational and operational risks linked to AI-generated content · identify situations requiring additional human oversight · apply safer decision-making when using AI in customer-facing or people-related activities.

**AI does not understand fairness in the way humans do.** Generative AI systems produce outputs based on patterns, probabilities, training data and context. AI outputs may reflect bias, reinforce stereotypes, misinterpret nuance, or generate inappropriate recommendations. In a business environment this may create reputational damage, customer complaints, discrimination concerns, operational issues, loss of trust.

**Important principle.** AI-generated content should never be assumed to be neutral, fair, unbiased or contextually appropriate. Human oversight remains essential.

**What is bias?** Bias occurs when outputs unfairly favour, disadvantage or stereotype individuals or groups. May appear in recruitment decisions, customer communications, summarisation, recommendations, scoring systems, or generated content. Bias is not always intentional. Sometimes it results from incomplete context, training data limitations, assumptions within prompts, or missing human oversight.

*Scenario 1 — "The AI preferred certain candidates":* recruitment manager uses AI to help shortlist CVs. Prompts unintentionally favour specific career paths, certain language styles, particular educational backgrounds. Over time similar candidate profiles are repeatedly prioritised while others are filtered out. Risks: discrimination concerns, unfair hiring outcomes, reputational damage, governance failures. **Key lesson:** AI-assisted recruitment decisions require oversight, governance and human review.

*Scenario 2 — "The marketing content caused complaints":* marketing employee uses AI to generate social media content. AI creates messaging that unintentionally stereotypes a customer group, uses inappropriate wording, lacks cultural awareness. Content is published without review. Risks: reputational harm, customer complaints, brand damage, public criticism. **Key lesson:** AI-generated content should always be reviewed for tone, fairness, accuracy and appropriateness.

*Scenario 3 — "The AI made assumptions":* customer support employee asks AI to summarise a complaint. AI makes assumptions about customer intent, introduces inaccurate emotional language, changes the tone of the original issue. Employee forwards the summary without checking. Risks: customer dissatisfaction, inaccurate records, reputational concerns, operational inconsistency. **Key lesson:** AI summaries may unintentionally distort context or meaning. Human review remains essential.

**Why AI bias happens.** AI systems learn from existing information, public content, historical patterns, human-generated data. Outputs may reflect historical bias, incomplete representation, flawed assumptions, missing context. Generative AI systems do not understand ethics, fairness or organisational values in the same way humans do.

**Areas requiring extra caution.** Additional oversight may be required when AI is used for recruitment · HR processes · disciplinary matters · customer decisions · performance scoring · legal interpretation · healthcare-related information · financial recommendations.

**Human oversight matters.** AI should support productivity, drafting, summarisation and idea generation. AI should not independently determine employment outcomes, disciplinary action, customer fairness or sensitive operational decisions without appropriate governance and review.

**Practical safeguards.** (1) Review AI outputs carefully — check for inappropriate assumptions, stereotypes, missing context, tone issues, exclusionary wording. (2) Avoid blind automation — do not automatically trust scoring systems, rankings, summaries or recommendations without human oversight. (3) Use diverse review — involve different perspectives, escalate sensitive outputs, apply governance review processes. (4) Follow organisational policy — some AI use cases may require approval, governance review or additional oversight before deployment.

**Red / Amber / Green.** GREEN (lower-risk): brainstorming ideas · drafting generic content · grammar improvements · summarising non-sensitive information — still requires review. AMBER (requires human oversight): customer communications · employee-related content · marketing campaigns · operational recommendations. RED (high-risk without governance): automated hiring decisions · disciplinary recommendations · AI-only customer outcomes · sensitive people-related decisions without oversight.

**Practical workplace rule.** Before using AI-generated content: review tone, check fairness, validate context, apply professional judgement. If the output affects people, customers, employment or reputation, additional oversight may be required.

**Key takeaways:** AI systems may produce biased or inappropriate outputs · bias may result from training data, assumptions or missing context · human oversight remains essential · sensitive decisions require additional governance and review · AI should support judgement, not replace it · reputational risk can arise from poorly reviewed AI-generated content.

---

### MODULE 08 — Logging, Accountability, And Auditability

**Duration:** 8–10 minutes

**Learning outcomes:** understand why accountability matters when using AI · recognise the importance of auditability and record keeping · understand why organisations need visibility over AI usage · apply safer operational behaviours when using AI tools.

**AI usage should not be invisible.** As organisations increasingly adopt AI tools, they also need to understand how AI is being used, where it is being used, who is using it, and what business decisions are being influenced by it. This is important for governance, operational oversight, compliance, security and accountability. If an organisation cannot understand how AI is being used, it becomes difficult to investigate incidents, manage risk, verify decisions, or demonstrate governance maturity.

**What is accountability?** Accountability means humans remain responsible for decisions, organisations remain responsible for governance, and AI outputs should be traceable and reviewable where appropriate. Even when AI assists with drafting, analysis, recommendations or summarisation, humans remain accountable for approvals, operational decisions, customer impact and compliance obligations.

**What is auditability?** Auditability means organisations may need the ability to review AI usage, understand decision-making processes, verify actions, and investigate incidents when necessary. May include system logs, approval records, policy acknowledgements, governance workflows, training completion evidence.

*Scenario 1 — "Nobody knew the AI had been used":* customer complaint escalates after incorrect information provided during a support interaction. Employee later explains "I used AI to generate the response." No record exists, no review process was followed, leadership cannot determine what information was entered, what the AI generated, or how the response was approved. Risks: governance failures, operational uncertainty, reputational damage, inability to investigate properly. **Key lesson:** Where AI influences business activity, organisations may require visibility and accountability.

*Scenario 2 — "The AI-generated report was challenged":* manager uses AI to create a summary report for leadership. Later figures are questioned, assumptions appear incorrect. Leadership asks "how was this generated?" Employee cannot explain the prompt, reproduce the process, or verify which information came from AI. Risks: poor auditability, operational confusion, reduced trust, governance concerns. **Key lesson:** AI-assisted work should remain reviewable and explainable where appropriate.

*Scenario 3 — "The organisation had no AI oversight":* business discovers employees are using multiple AI tools, personal accounts, browser extensions, AI-enabled SaaS platforms. No inventory exists, no governance controls, no approved AI list. Leadership cannot determine which tools are being used, what information is being processed, or which risks exist. Risks: unmanaged shadow AI, supplier governance concerns, operational risk, compliance exposure. **Key lesson:** Organisations require visibility into AI usage to manage operational risk effectively.

**Why logging & oversight matter.** Organisations may need to investigate incidents, review customer complaints, validate decisions, support compliance activities, or demonstrate governance maturity. Without visibility, problems become harder to investigate, accountability becomes unclear, governance weakens.

**Accountability principles.** (1) Humans remain responsible — AI may assist with work but humans remain accountable for decisions, approvals and business outcomes. (2) Important AI usage should be traceable — organisations may require logging, approvals, review workflows or audit evidence, especially for customer-facing activity, regulated processes and operational decision making. (3) Governance requires visibility — organisations cannot effectively govern unknown tools, unmanaged AI usage or hidden workflows. Visibility supports oversight, risk management, operational maturity. (4) Documentation matters — prompts, approvals, review decisions and AI-assisted outputs may need to be documented or retained according to organisational policy.

**Practical examples of auditability.** AI training completion records · policy acknowledgement logs · approved AI tool inventories · governance approvals · prompt review processes · workflow approvals · AI usage reporting · incident records.

**Red / Amber / Green.** GREEN (good governance behaviour): using approved AI tools · documenting important decisions · following approval workflows · escalating concerns appropriately. AMBER (additional oversight): AI-assisted customer communications · operational summaries · AI-assisted reporting · workflow automation. RED (weak governance behaviour): using unapproved AI tools without visibility · relying on AI outputs without review · bypassing approval processes · failing to document important AI-assisted activity.

**Practical workplace rule.** When using AI: follow organisational policy, use approved tools, maintain appropriate records where required, ensure important outputs remain reviewable and explainable. If unsure, escalate before proceeding.

**Key takeaways:** Organisations require visibility into AI usage · humans remain accountable for AI-assisted work · auditability supports governance, compliance and operational oversight · shadow AI weakens organisational control · important AI-assisted activity may require documentation and review · governance maturity depends on visibility and accountability.

---

### MODULE 09 — AI Incidents, Escalation, And What To Do When Something Goes Wrong

**Duration:** 8–10 minutes

**Learning outcomes:** understand what an AI-related incident may look like · recognise when escalation is required · understand the importance of rapid reporting · apply safer behaviours when something goes wrong involving AI.

**AI incidents are operational incidents.** They may involve data exposure, incorrect outputs, governance failures, security concerns, supplier issues or reputational risk. Many AI incidents begin with misunderstanding, poor judgement, accidental oversharing, or use of unapproved tools. The goal is not "never make mistakes" — it is identify issues quickly, reduce impact, escalate appropriately. Early reporting often reduces operational damage, compliance exposure, customer impact and recovery costs.

**What is an AI incident?** Any event involving AI usage that may create operational risk, governance concerns, security exposure, reputational damage or compliance issues. Examples: confidential information entered into an unapproved AI tool · AI-generated misinformation shared externally · AI-assisted phishing or impersonation · use of unapproved AI systems · AI-generated biased or inappropriate content · customer complaints involving AI-generated responses · AI-assisted security misconfiguration · unauthorised AI plugins or browser extensions.

**Important principle.** Reporting an issue early is usually safer than hiding it. Organisations generally prefer rapid escalation, transparency and controlled response rather than delayed discovery.

*Scenario 1 — "The customer data was pasted accidentally":* employee realises they pasted customer information into a public AI chatbot while trying to summarise a support issue. Initially considers "not telling anyone because it was an accident." Several days later issue is discovered during audit review, creating larger governance and operational concerns. Risks: delayed response, governance failures, reduced containment options, potential compliance exposure. **Key lesson:** Early escalation may significantly reduce organisational risk.

*Scenario 2 — "The AI-generated response was incorrect":* customer-facing AI-assisted email contains inaccurate information. Response was not properly reviewed, reaches the customer, causes confusion and escalation. Employee hesitates to report because "the mistake already happened." Risks: customer dissatisfaction, reputational harm, operational confusion, delayed remediation. **Key lesson:** Rapid reporting improves the organisation's ability to correct errors, support customers and investigate root causes.

*Scenario 3 — "Nobody approved the AI plugin":* employee installs an AI browser extension that automatically processes internal information. Extension was never reviewed, is not approved, creates unknown supplier governance risks. Issue only discovered months later. Risks: unmanaged shadow AI, supplier governance concerns, operational visibility gaps, security uncertainty. **Key lesson:** Unapproved AI tooling should be escalated early, even if no incident has yet occurred.

**Common types of AI incidents.** (1) Data exposure — customer info into unapproved AI · confidential info processed externally · oversharing through enterprise AI. (2) Misinformation — AI-generated inaccuracies shared externally · fabricated references or summaries · incorrect operational guidance. (3) Governance violations — unapproved AI usage · bypassing approval processes · unauthorised plugins or SaaS tools. (4) Security incidents — AI-assisted phishing · credential exposure · infrastructure information entered into AI systems. (5) Reputational incidents — biased AI-generated content · inappropriate outputs · customer complaints linked to AI usage.

**When to escalate.** Escalation may be appropriate if sensitive information was entered into AI · customer impact exists · output appears incorrect or harmful · unapproved AI tool is discovered · security concerns exist · organisational policy may have been breached. If unsure, escalate and ask.

**What good escalation looks like.** Prompt, factual, transparent, calm. Objective: containment, risk reduction, appropriate response.

**What to include in an escalation.** Where possible: what happened · what AI tool was involved · what information may have been affected · when it occurred · who has been informed · any immediate containment actions already taken. Do not hide information, attempt to quietly delete evidence, or continue using the affected system without guidance.

**Human behaviour matters.** Many incidents become worse because employees panic, delay reporting, or try to fix issues alone. Good governance culture encourages transparency, escalation and learning.

**Red / Amber / Green.** GREEN (good incident behaviour): reporting issues quickly · escalating uncertainty · following governance process · documenting concerns appropriately. AMBER (immediate review): accidental data entry into AI · suspicious AI-generated outputs · unapproved AI tooling · customer-facing AI errors. RED (high-risk behaviour): hiding mistakes · bypassing escalation · deleting evidence · continuing unsafe AI usage · ignoring governance concerns.

**Practical workplace rule.** If something involving AI feels wrong, appears risky or may impact the organisation, do not ignore it. Escalate early using approved organisational processes.

**Key takeaways:** AI incidents may involve governance, security, operational or reputational risk · early escalation usually reduces organisational impact · transparency and accountability support effective response · unapproved AI usage may itself represent a governance concern · good governance culture encourages escalation, not blame · human behaviour strongly influences incident outcomes.

---

### MODULE 10 — The 60-Second AI Safety Checklist

**Duration:** 5–7 minutes

**Learning outcomes:** understand a simple operational framework for safer AI usage · apply quick decision-making before using AI tools · recognise when escalation or additional oversight may be required · develop safer day-to-day AI habits.

**Most AI-related problems begin before the prompt is entered.** Usually because someone rushed, assumed the tool was safe, skipped verification, or used AI without thinking through the risk. The purpose of this checklist is not to slow down productivity, create unnecessary bureaucracy, or block innovation. The goal is to create safer habits, better judgement and consistent operational behaviour. This checklist should take less than 60 seconds.

**The 60-second checklist — before using AI, pause and ask:**

1. **Is the tool approved?** Is this AI platform approved by the organisation? Am I using a personal account or approved enterprise environment? Has this tool gone through governance or security review? Higher-risk examples: personal ChatGPT accounts · AI browser extensions · unapproved SaaS tools · AI plugins installed without review. Safer practice: use approved enterprise AI platforms wherever possible.

2. **What information am I entering?** Does this contain customer data · confidential information · pricing · HR records · source code · contracts · security information? If yes: additional controls, approval or escalation may be required.

3. **Would I be comfortable explaining this AI usage?** To leadership · compliance · a customer · an auditor? Would the organisation expect this information to be processed externally? If unsure: stop and ask.

4. **Does the output need verification?** Could this output affect customers · finance · legal matters · HR · operations · reputation? If yes: human review, validation, oversight are essential.

5. **Could this create bias, harm or embarrassment?** Could this create reputational risk · misrepresent someone · introduce bias · create offensive or inappropriate content · cause customer concern? AI-generated outputs should always be reviewed for fairness, tone, context.

6. **Would I know what to do if something went wrong?** If this created an incident · data exposure · customer issue · governance concern — would I know who to contact, how to escalate, what process to follow? If not, review organisational guidance before proceeding.

*Scenario — "It only took 30 seconds":* employee uses a public AI chatbot to improve wording in a customer proposal. Before submitting the prompt they pause and apply the checklist. Realise: customer information is included · AI tool is not approved · organisation provides a governed enterprise AI alternative. Employee switches to the approved platform and removes unnecessary sensitive information before proceeding. Outcome: risk reduced, governance followed, productivity maintained, safer operational behaviour applied. **Key lesson:** Small pauses often prevent larger incidents.

**The purpose of governance.** Not designed to block productivity, prevent experimentation or discourage innovation. Good governance helps organisations adopt AI safely, reduce avoidable risk, improve accountability and scale AI usage responsibly.

**Red / Amber / Green.** GREEN: using approved tools · checking information sensitivity · verifying outputs · escalating concerns · following governance guidance. AMBER (pause & review): customer-facing outputs · internal business summaries · AI-generated recommendations · new AI tools or plugins. RED (stop & escalate): confidential information entered into unapproved AI · bypassing governance processes · using AI outputs without review · ignoring operational concerns · using unapproved AI tooling.

**Practical workplace rule.** Before using AI: pause, think, verify, apply governance. A short review process may prevent operational incidents, governance failures, customer impact and reputational damage.

**Key takeaways:** Most AI risks can be reduced through simple behavioural checks · governance supports safe AI adoption rather than blocking innovation · human judgement remains essential · approved tools, verification and escalation reduce operational risk · small pauses often prevent larger problems · safe AI usage is a shared organisational responsibility.

---

### MODULE 11 — Final Assessment & AI Safe@Work Certification

**Duration:** 10–15 minutes

**Learning outcomes:** demonstrate understanding of safe AI usage principles · apply governance and operational thinking to realistic scenarios · recognise when escalation and oversight are required · complete the AI Safe@Work certification assessment.

**AI governance is now part of modern workplace responsibility.** Throughout this course you have learned how AI tools process information, why governance matters, how to reduce operational risk, how to identify unsafe usage, and why human oversight remains essential. The purpose of the assessment is not to catch people out, discourage AI usage or create fear around technology. The objective is to confirm that employees can use AI more safely, recognise governance boundaries and apply responsible decision-making in day-to-day work.

**Assessment overview.** Multiple choice questions · scenario-based exercises · operational judgement questions · governance awareness checks. **Suggested pass mark: 80%.** Assessment outcomes should demonstrate understanding, judgement and practical workplace awareness.

**Scenario 1 — Customer Information.** Support employee wants to use AI to summarise a customer complaint email (contains names, account references, sensitive customer information). Employee plans to use a free public AI chatbot. **Answer (B):** Remove sensitive information and use an approved enterprise AI platform if organisational policy allows.

**Scenario 2 — AI-Generated Report.** Manager uses AI to generate a business summary for leadership. AI output looks professional, includes statistics, provides operational recommendations. Manager has not verified the information. **Answer (B):** Verify important information, review the recommendations and apply human oversight.

**Scenario 3 — Suspicious Request.** Employee receives an urgent Teams message appearing to come from a senior executive requesting immediate payment approval. Message sounds realistic, references genuine projects, pressures fast action. **Answer (B):** Verify using another approved communication channel and follow organisational process.

**Scenario 4 — AI Plugin Discovery.** Employee discovers a browser extension automatically sending webpage content to an external AI service. No governance approval exists. **Answer (C):** Escalate the issue according to organisational governance or security processes.

**Scenario 5 — Recruitment Decision.** Hiring manager uses AI to score job candidates automatically. Manager notices the AI consistently ranks certain candidates lower without clear reasoning. **Answer (B):** Review the process critically, apply human oversight and follow organisational recruitment governance.

**Operational judgement Q1.** Which statement is TRUE? **Answer (B):** Human oversight remains essential when using AI.

**Operational judgement Q2.** What is an example of "shadow AI"? **Answer (C):** Using unapproved AI tools or personal AI accounts for business activity.

**Operational judgement Q3.** Which type of information should generally not be entered into unapproved AI systems? **Answer (D):** All of the above (confidential customer information, passwords and API keys, commercial pricing).

**Certification outcome.** Employees who successfully complete the assessment may receive **AI Safe@Work Certification**. May include: learner name · organisation · completion date · certificate ID · expiry/review date · course version reference.

**Organisational benefits.** Completion records may support governance evidence · workforce awareness tracking · audit readiness · operational maturity · AI governance initiatives.

**Continuing responsibility.** Completing this course does not mean AI is risk free, governance is no longer required, or human oversight can be removed. Safe AI usage requires ongoing awareness, good judgement, operational governance and responsible behaviour.

**Final workplace reminder.** Before using AI: pause, think, verify, follow organisational guidance. If unsure: ask before proceeding.

**Final key takeaways.** AI can provide significant productivity and business benefits · governance supports safe and responsible AI adoption · human oversight remains essential · approved tools, verification and escalation reduce operational risk · accountability stays with people and organisations, not the AI system · safe AI usage is a shared organisational responsibility.

**Course completion outcome.** You have completed **AI Safe@Work — Safe AI Usage & Governance Awareness**. You should now be able to recognise common AI-related risks, apply safer operational behaviours, identify governance concerns and use AI tools more responsibly within a workplace environment.

---

### Implementation notes for v2 platform build

| Decision | v2 direction |
|---|---|
| Module count | 11 |
| Tone | Governance-led, operational, organisation-neutral |
| Standards posture | Cited inline where relevant; no dedicated standards module |
| Red/Amber/Green | Required pattern in every module |
| Final-module shape | Assessment + cert, not checklist |
| MVP first | Landing + overview + nav + progress + mobile · assessments + certs added later · platform stays flexible (add/remove/reorder modules) |
| Existing v1 build | Stays live at <https://aisafework.netlify.app/> as v1 reference. Decision on full pivot to v2 pending |
| Source-of-truth | This doctrine section + `.audit/course-quality/v2-content-source-2026-05-31.txt` + `AI_SafeAtWork_Course_Content_v1_Word.docx` (committed) |

### v2 vs v1 — open questions for the founder

1. **Hard pivot or parallel run?** Replace v1 12-module shipped course w/ v2 11-module rewrite, or keep v1 live + build v2 as a separate `/v2/` track?
2. **Existing MCQs + widgets + cert** — pull them (per "ability to add later") or keep as the head-start the founder calls "enough to prove the concept"?
3. **Module 11 = final assessment.** v2-M11 is the assessment + cert. Existing per-module MCQs would duplicate. Resolution: per-module MCQ stays as practice; M11 is the formal certifying assessment.
4. **Standards mapping** — deferred to roadmap layer per founder. Existing `/standards-map.html` page stays public as part of v1 reference; v2 rebuild defers it.
5. **Tracks** — Manager + DPO already shipped in v1. v2 roadmap lists them as future. Resolution: keep shipped; v2 will refine rather than rebuild.

---

## § Pre-launch security checklist (added 2026-06-02)

> Source: external "Ship Products, Not Liabilities" checklist for AI builders shipping with Cursor, GPT, Bolt, Replit and similar tools. Adopted verbatim as doctrine. Treated as a hard gate on every commit that introduces a new surface, endpoint, form, dependency, or third-party integration. Full per-item evidence log lives at `.audit/security/pre-launch-checklist-2026-06-02.md` and is re-walked quarterly per § Refresh cadence — operational.

### 01 — Legal & Privacy

| # | Checklist item | Required by AI Safe@Work | How we comply |
|---|---|---|---|
| 1.1 | Add a privacy policy to your app | Yes | `privacy.html` published at site root. Plain English. Lists every data category collected (current answer: none). Reviewed on every quarterly refresh. |
| 1.2 | Know exactly where user data is stored | Yes | Static-only architecture; no user data is collected by AI Safe@Work itself. The only client-side state is `localStorage` (browser-local, never transmitted). Documented in `privacy.html` and in `.audit/privacy/ropa.md`. |
| 1.3 | Understand your GDPR / data law obligations | Yes | EU-first project; full RoPA, sub-processor register, DPIA on own AI use, breach-response plan and retention schedule live in `.audit/privacy/`. Public-facing privacy notice covers GDPR + UK GDPR. Cookie consent is N/A — no cookies are set. Data-deletion endpoint is N/A — no data is held. If/when a paid surface adds an account system, all three flip to mandatory; gates 16–20 in § Procurement-readiness gates capture the launch blockers. |
| 1.4 | Don't collect data you don't need | Yes | Zero-collection by default. New data fields require explicit doctrine sign-off + RoPA update before shipping. |
| 1.5 | Add a terms of service page | Yes | `terms.html` published at site root. Commercial-tier Terms extension (gates list item 18) is a documented launch blocker before pricing.html comes out of `noindex`. |

### 02 — Security basics

| # | Checklist item | Required by AI Safe@Work | How we comply |
|---|---|---|---|
| 2.1 | Scan against OWASP Top 10 | Yes | Full 2021 Top 10 review for v2 at `.audit/security/owasp-top10-v2-2026-05-31.md`. v1 carries forward a lighter posture documented in the same folder; a v1-equivalent review is appended on any v1 architectural change. |
| 2.2 | Check all security headers | Yes | Site-wide `_headers` block ships HSTS preload + X-Content-Type-Options + X-Frame-Options DENY + Referrer-Policy + Permissions-Policy + Content-Security-Policy + Cross-Origin-Opener-Policy + Cross-Origin-Resource-Policy + X-XSS-Protection:0. `/v2/*` ships a stricter CSP and `Referrer-Policy: no-referrer`. |
| 2.3 | Test for SQL injection on every input | Yes | N/A by architecture — no database in either v1 or v2. The only persistent state is browser-local `localStorage`, accessed through helpers that shape-validate inputs (`/^\d+$/` on keys, enum check on values). If/when a backend is introduced, parameterised queries and prepared statements are doctrine; never string concatenation. |
| 2.4 | Test for XSS | Yes | All client-side DOM updates in `v2/assets/v2.js` use `createTextNode()` + `setAttribute()`. No `innerHTML = ...` of user-derived data anywhere; verification grep documented in OWASP doc. Strict CSP (`script-src 'self'`, no inline scripts, no `'unsafe-inline'` in v2 styles, `object-src 'none'`) blocks injected payloads at the browser. `cert.html` user-name input is escaped via `escapeHtml()` before insertion. |
| 2.5 | Verify authentication and session handling | Yes | N/A by architecture — no auth, no sessions. If/when a paid surface ships, doctrine: device-bound MFA on every account, refresh-token rotation, no opaque tokens in localStorage (httpOnly+SameSite=Strict cookies only), short-TTL access tokens + rotating refresh. Procurement-readiness gate 17 (PI / cyber insurance) captures the wider readiness check. |

### 03 — Secrets & API keys

| # | Checklist item | Required by AI Safe@Work | How we comply |
|---|---|---|---|
| 3.1 | Check that `.env` files are in `.gitignore` | Yes | `.gitignore` covers `.env`, `.env.*` (with `!.env.example` allowed for templates), `*.pem`, `*.key`, `secrets/`. Verified by `git ls-files | grep -E "\.env\|secret\|\.pem\|\.key$"` returning empty. |
| 3.2 | No API keys in frontend / client-side code | Yes | No API keys exist in the project — the static site makes no third-party API calls. Verified by `grep -rE "sk-[a-zA-Z0-9]{20,}"` returning zero tracked-file hits. |
| 3.3 | Check API responses for sensitive data leaks | Yes | N/A — no API endpoints. When `pricing.html` lifts to commerce, payment intents, customer IDs, internal record IDs and any vendor-side reference numbers stay server-side and never round-trip to the client beyond what the user typed themselves. |
| 3.4 | Remove secrets from logs and error messages | Yes | The only logging is `console.warn` / `console.error` inside `v2.js`. Messages are about rate-limit triggers and manifest-load failures; nothing dynamic from user input is included. Verified by reading `v2/assets/v2.js`. Server-side logging policy when introduced: never log full request bodies for paths that may carry tokens or PII; structured logs with allow-listed field set only. |
| 3.5 | Move all keys server-side or behind a proxy | Yes | N/A — no third-party AI vendor is called from the site. When that lands (e.g. cert verification API or a contact-form mailer), keys live in server-side environment variables, validated at boot, never echoed in error responses. |

### 04 — Abuse prevention

| # | Checklist item | Required by AI Safe@Work | How we comply |
|---|---|---|---|
| 4.1 | Add rate limiting to all API endpoints | Yes | N/A by architecture — no API endpoints in v1 or v2. Posture document at `.audit/security/v2-rate-limiting-posture.md` records this fact + lists explicit triggers (first API endpoint, first DB query, first auth endpoint, first webhook receiver, first cert-generation endpoint) that flip mandatory rate-limit configuration on. Client-side `localStorage` throttle (10 writes/sec) implemented in `v2.js` as defence-in-depth. |
| 4.2 | Set up spend alerts and hard caps on paid APIs | Yes | N/A — no paid APIs are called. When the first one ships, doctrine: vendor-side hard cap **and** independent budget alert at 50% / 75% / 90%. Hard cap below founder's monthly burn tolerance. Spend dashboards reviewed weekly. |
| 4.3 | Add input validation on every user-facing field | Yes | Only user-facing input today is the `cert.html` user-name field; validated for non-empty + length-capped + `escapeHtml()` on output. `localStorage` reads validated by regex + enum check before use. When forms are introduced, validate type + length + format + range on both client (UX) and server (security boundary). |
| 4.4 | Implement basic bot protection | Yes | N/A today — no signup, no login, no form submission to any endpoint. When signup ships: doctrine requires Cloudflare Turnstile or hCaptcha + honeypot field + rate-limited POST per IP + email verification before account is usable. |
| 4.5 | Plan for abuse scenarios before they happen | Yes | `.audit/security/incident-log.md`, `.audit/privacy/breach-response-plan.md`, `.audit/ai/ai-incident-log.md` already exist. A surface-specific abuse plan is required before any new commerce / account / upload / API surface ships. |

### 05 — Copy-paste security prompts

The five prompts in the source checklist are kept verbatim in `.audit/security/pre-launch-checklist-2026-06-02.md` for any AI-assisted security re-audit. Founder is to paste them into the assistant of choice as the **first** action on any quarterly refresh that touches a surface listed under § Procurement-readiness gates or any new feature introducing accounts / APIs / DBs / file uploads / paid surfaces.

### Operating rule

> "AI builds the app. You secure it."

This section is doctrine, not aspiration. **A commit that introduces a new surface, endpoint, form, dependency or third-party integration does not ship until every applicable line above is green** and the per-item evidence is recorded in `.audit/security/pre-launch-checklist-YYYY-MM-DD.md` for that change. Items currently marked N/A become hard gates the moment the architecture changes.

---

## Related

- [[ai-safe-at-work]] — project index
- [[../win2linux-course/doctrine|win2linux doctrine]] — sibling project, shared design DNA
- Repo: `~/.openclaw/workspace/ai-safe-at-work/`
- Static site: TBD canonical domain
- Audit source: see Chief-of-Staff session transcripts 2026-05-19
- v2 content source: `AI_SafeAtWork_Course_Content_v1_Word.docx` + `.audit/course-quality/v2-content-source-2026-05-31.txt`

#project #doctrine #ai-safety #compliance #eu-ai-act #iso-42001 #iso-27001 #gdpr #v2-direction #governance-led
