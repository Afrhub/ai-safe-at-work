# AI Safe@Work — Project Doctrine

> **Status:** LOCKED · 2026-05-19 · source-of-truth
> Every content, feature, partnership and pricing decision must move us
> toward closing one of the procurement gaps below or reinforce the wedge.
> If it doesn't, drop it or defer it.
>
> Canonical version: this file (`~/.openclaw/workspace/ai-safe-at-work/DOCTRINE.md`).
> Obsidian mirror: `second-brain/Projects/ai-safe-at-work/doctrine.md` — keep in sync.

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
5. **Default amber accent, dark glass, slow cinematic motion.** Brand consistency is part of trust.
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
| 5 | **FR + DE translations** (EN done) | EU literacy obligation, member-state language | 2–4 wk per language | **DONE 2026-06-03** (commit `310daf6`) — `v2/fr/` 13 files (`index`, `course`, `module-1`..`module-11`) + `v2/de/` 13 files. Every page banner: machine-translation pending native review + link back to canonical EN. `modules.json` extended w/ `i18n.supportedLocales` + per-module `locales.{fr,de}.{title,duration,summary}` + `ui.{en,fr,de}` UI dict. `v2.js` locale-aware: `manifestUrl()` resolves `../modules.json` from subdirs, `localiseModule()`, `getUi()`, `detectLocaleFromPath()`. Verified: 15/15 smoke URLs returned 200; FR M1 title "Pourquoi la gouvernance de l'IA compte"; DE M1 title "Warum KI-Governance wichtig ist". **Open**: native-speaker review pass before procurement deployment (shell ships now, native polish ships when translator budget approved). |
| 6 | **Role-based tracks** (board, manager, IC, DPO, dev) | Different roles → different obligations | 2–3 wk | **PARTIAL 4/6 2026-06-03** — Manager + DPO (v2026.05) + MSP / IT Admin + **Microsoft Copilot shipped today**. `/module-copilot.html` follows MSP-track shell: 12 sub-modules per outline at `.audit/course-quality/role-track-outlines/microsoft-copilot.md` covering Copilot variants + permissions-inheritance + 5-lever data residency + Purview sensitivity labels + Copilot Studio agent governance + M365 group hygiene + end-user prompt patterns + unified audit log w/ EU AI Act 26(6) retention overlay + Defender for Cloud Apps signals + Copilot-variant incident response first-hour + universal-course relationship + 10-question assessment. 524 lines, JSON-LD `LearningResource` + `BreadcrumbList`. Wired course.html / llms.txt / sitemap.xml. Remaining: Shadow AI, Governance & Procurement, AI Governance Officer, Developer/Technical AI (outlines for first three exist). 4 of 6 planned tracks live. |
| 7 | **Templates pack** (DPIA, FRIA, AUP, incident form, training register, vendor questionnaire) | Procurement loves "in the box" | 2 wk | **DONE 2026-06-03** — all six shipped under `/templates/`. AUP + vendor questionnaire (v2026.05). Today: `training-register.html` (EU AI Act Art 4 audit-grade evidence record, 8-column schema), `dpia-template.html` (GDPR Art 35, full risk-matrix, Art 36 trigger), `incident-form.html` (GDPR Art 33/34 + AI Act Art 73 + NIS2 + DORA reporting-deadline reference, full timeline + RCA + lessons), `fria-template.html` (EU AI Act Art 27, 7 Charter rights, Art 14 oversight, Art 27(3) authority notification). Each: printable A4, JSON-LD `HowTo` + `BreadcrumbList`, canonical URL, standards-mapping section, sign-off block. Wired into `course.html` Templates section (now 6 cards) + sitemap.xml. |
| 8 | **WCAG 2.2 AA audit + fixes** | Public sector + DDA compliance | 1–2 wk | **FIRST-PASS DONE 2026-06-03** — static audit across all 74 HTML files (35 v1 + 39 v2). Three Level A / AA fails fixed: (1) skip-to-content link added on every page via idempotent `scripts/inject-skip-link.py` + CSS (.skip-link), (2) `:focus-visible` block added across `a / button / summary / input / select / textarea / [tabindex]` in both `assets/style.css` and `v2/assets/v2.css` with `--focus-ring` var, (3) `--text3` contrast fix in both stylesheets (v1: `#445566`→`#8595a7` 2.6:1→6.7:1; v2: `#5e7286`→`#8595a7` 4.1:1→6.7:1). Audit doc: `.audit/accessibility/wcag-audit-2026-06-03.md`. Eight items (D1–D8) deferred to next-quarter manual + AT pass scheduled 2026-09 (axe-core, pa11y CI, NVDA + VoiceOver sweep, touch-target verification, focus-not-obscured testing). Accessibility statement updated to v2026.06 reflecting changes. |
| 9 | **Quarterly versioned changelog + RSS** | "Updated content" signal | 1 wk | **DONE 2026-06-03** — `changelog.xml` (RSS 2.0, two items: v2026.05 + v2026.06) + `changelog.json` (JSON Feed v1.1, same items) + `changelog.html` v2026.06 release entry. Feed-discovery `<link rel="alternate">` in changelog `<head>`; visible "Subscribe: RSS · JSON Feed" line under lede. Feeds added to sitemap.xml. |
| 10 | **Sector overlays — finance, healthcare, public-sector first** | Each unlocks a vertical sales motion | 3–6 wk each | TODO |
| 11 | **Manager / trainer rollout guide** | Internal adoption aid | 1 wk | **DONE 2026-06-03** — `/rollout-guide.html` dual-audience (internal manager + MSP partner): week-0 prep checklist, week-1 launch + sample kickoff message, week-2 completion drive, week-3 assessment + cert, week-4 embed + audit binder. Roles + responsibility matrix (7 roles, time-per-week). 7-KPI table (completion / pass-rate / AUP / register / incidents / time-to-escalate / refresh). 9-row common-pitfall table. Each week has an MSP-variant purple-callout (multi-customer cohorts, staggered kickoffs, per-customer registers, white-label posture). 8 artefact handover checklist at end. JSON-LD `HowTo` w/ 5 steps. Wired into `course.html` (callout pre-"How to use this course"), `msp.html` (CTA line under lede), `llms.txt` (new "Rollout" section + lede bump to "6 templates + 30-day rollout guide"), `sitemap.xml`. |
| 12 | **HTTPS + production domain** | Required for any serious deployment | <1 day | **PARTIAL 2026-06-03** — current canonical = Netlify subdomain `aisafework.netlify.app` (HTTPS live, HSTS preload pending). RDAP availability scan + purchase recipe + DNS recipe filed at `.audit/legal/domain-procurement-2026-06-03.md`. Purchase blocked on financial action (user). |
| 13 | **JSON-LD (`Course`, `LearningResource`, `FAQPage`, `BreadcrumbList`) + sitemap.xml + robots.txt + llms.txt** | Discoverability + AI-citation engines | 2 hr | **DONE 2026-06-03** for v1 (existing) + v2 (new). v2: 39 pages × 2 JSON-LD blocks (WebSite/Course/LearningResource + BreadcrumbList) via `scripts/inject-v2-seo.py` (idempotent splicer, marker `v2-seo:injected v1`). Sitemap + robots already shipped v1; v2 sitemap entries deferred until `noindex` lifted. |
| 14 | **OpenGraph + Twitter card meta per page** | Social / chat sharing | 1 hr | **DONE 2026-06-03** for v1 (existing) + v2 (new). v2: same splicer injected OG + Twitter card meta + locale alternates across 39 pages (EN/FR/DE). |
| 15 | **Accreditation partnership for CPD / CPE credit** (IAPP, ISACA, ISC2) | Cert maintenance buyers | multi-month, external | TODO |

Gates 1, 2, 3, 13, 14 are the **week-one block**. Gates 4–7 are the **quarter-one block**.

**Status as of 2026-06-03 (end of day)**: gates 1, 2, 3, 4, 5, 7, 9, 11, 13, 14 closed. Gate 6 advanced from 2/6 → 3/6 (MSP/IT Admin track shipped today). Gate 8 advanced from "partial — needs audit" → first-pass DONE (manual + AT pass scheduled 2026-09). Gate 12 partial (recipe ready, purchase blocked on user financial action). Week-one block fully closed; quarter-one block reduced to gate 6 remainder (3 role tracks: Microsoft Copilot, Shadow AI, Governance & Procurement / AI Governance Officer / Developer-Technical). Procurement-side: gate 15 (CPD accreditation — external multi-month) + gate 10 (sector overlays — multi-week per vertical) remain. Strong position for first MSP-partner activation; MSP-side track + WCAG first-pass audit close both public-sector and accessibility-conformance blockers.

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
| 1 | Open ChatGPT. Paste: `Read https://aisafeatwork.org/module-3.html and list the 9 categories of data that should never go into a public AI tool.` | ChatGPT returns the 9 categories AND shows the URL as a source link. |
| 2 | Open Claude. Same prompt. | Same. |
| 3 | Open Perplexity. Same prompt (or browse to perplexity.ai and ask). | Returns the 9 categories with our URL listed in the source pills. |
| 4 | Open Google. Search `site:aisafeatwork.org "never-paste"` | Module 3 appears in results. |
| 5 | Open Bing. Same search. | Module 3 appears in results. |

**Fail = wedge broken.** Investigate immediately: check robots.txt for accidental blanket `Disallow: /`, check `tdm-policy.json` for syntax errors, check no edge bot-mgmt rule went too broad, check Google Search Console for "blocked by robots.txt" warnings.

#### Test 2 — Rules are present and correct in the served files

Goal: confirm the published `robots.txt` and `tdm-policy.json` actually contain the intended rules (no deploy regression).

| Step | URL | What to verify present |
|---|---|---|
| 1 | <https://aisafeatwork.org/robots.txt> | `User-agent: GPTBot` followed by `Disallow: /` — confirms training-bot block site-wide |
| 2 | same | `User-agent: ChatGPT-User` followed by `Disallow: /paid/` and `Allow: /` — confirms citation-bot allowed on free, blocked on paid |
| 3 | same | `User-agent: CCBot` → `Disallow: /` — confirms Common Crawl block (indirect training-data protection) |
| 4 | same | `Sitemap: https://aisafeatwork.org/sitemap.xml` line still present |
| 5 | <https://aisafeatwork.org/tdm-policy.json> | Returns valid JSON; `"tdm-reservation": 1`; `"prohibited-purposes"` array includes `training-of-machine-learning-models`; `"last-reviewed"` date within last 90 days |
| 6 | <https://aisafeatwork.org/llms.txt> | Still present (citation engines depend on it); covers free-core paths only |

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

- Free pages: 12 modules + role tracks + templates + standards-map + citations + changelog + accessibility + complaints + privacy + terms + pricing draft + landing + course overview.
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
- [ ] Enable Cloudflare Bot Management on `*.aisafeatwork.org/{paid,account,customer,api,admin}/*` (or equivalent paths).
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
| § Audience hierarchy | Expanded — add MSP / IT Admin and Governance Officer tracks alongside existing role tracks. P-numbers unchanged. |
| § Audit-readiness | Strengthened — two-entity NewCo + Consultancy split adds future complexity but maps cleanly (each entity needs its own RoPA, ISMS, etc.). |
| § Anti-scraping + AI-crawler controls | Unchanged — paid surfaces only; MSP white-label is a paid surface, so already protected by existing scope. |

### § Open strategic TODOs

- [x] Update `index.html` lede + positioning copy to lead with "AI Governance Awareness + Enablement Platform" — shipped 2026-05-19
- [ ] Build Microsoft Copilot governance track outline
- [ ] Build Shadow AI track outline
- [ ] Build MSP / IT Admin role track
- [ ] Build Governance & Procurement role track
- [ ] Build AI Governance Officer role track
- [ ] Build remaining governance packs (Risk Register · Incident Process · Approval Workflows · Procurement Pack · Manager Pack · Governance Quick Start)
- [x] Build dedicated MSP page (`/msp.html`) — partner programme, white-label terms, MSP-specific pricing — shipped 2026-05-19
- [ ] Draft MSP white-label commercial terms (extends `pricing.html` Enterprise tier)
- [ ] Two-entity (NewCo SaaS + Consultancy) structure decision: when, what jurisdiction, profit split
- [ ] Advisory / consulting day-rate + retained-advisory pricing
- [ ] Reframe `course.html` to position Awareness Platform as one of three pillars
- [ ] Sector-specific governance packs (Healthcare · Financial Services · Public Sector · Education · Legal · Defence supply chain)
- [ ] ITIL + AI Operations Governance positioning paper (Pillar 3 entry into ops-heavy MSPs)

---

## Decision log

| Date | Decision | Why |
|---|---|---|
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
| 2026-06-03 | **Gate 6 advanced 3/6 → 4/6 — Microsoft Copilot role track shipped.** `/module-copilot.html` is the fourth role track. Single page, 12 sub-modules per outline at `.audit/course-quality/role-track-outlines/microsoft-copilot.md`: (1) Five-variant Copilot taxonomy + governance differences, (2) permissions-inheritance problem + SharePoint Advanced Management oversharing report, (3) five-lever data-residency picture + EU Data Boundary cautions, (4) Purview sensitivity labels + protection-not-label rule, (5) Copilot Studio agent governance + Power Platform environment strategy + DLP, (6) Microsoft 365 group hygiene as upstream control, (7) end-user prompt patterns (cite / boundary / two-step verify), (8) unified audit log + Article 26(6) retention extension, (9) Defender for Cloud Apps signal catalog + operationalisation, (10) Copilot-variant incident response first-hour (preserve evidence, fix permissions not Copilot), (11) universal-course relationship table, (12) 10-question assessment. 524-line single-page HTML, JSON-LD `LearningResource` + `BreadcrumbList`. Wired into course.html role-tracks grid (now 4 cards, eyebrow + lede → "four role tracks"), llms.txt (4th entry + lede bump), sitemap.xml (priority 0.88). Skip-link injector run; canonical present; outline status flipped to SHIPPED. | Closes the largest single-vendor AI-governance enablement gap for M365-using SMBs (estimated 200k+ EU+UK SMBs running M365 Business / Enterprise with Copilot pipeline active). MSP partners get the Copilot-rollout track they can pre-sell. |

| 2026-06-03 | **Gate 8 first-pass DONE — WCAG 2.2 AA audit + fixes.** Static audit across all 74 HTML files (35 v1 + 39 v2). Three Level A / AA fails fixed: (1) skip-to-content link sitewide via idempotent splicer `scripts/inject-skip-link.py` + `.skip-link` CSS (jumps to `#main` landmark; v2 + v1); (2) `:focus-visible` block expanded across all interactive elements in both stylesheets with `--focus-ring` var; (3) `--text3` colour bumped in both stylesheets to deliver 6.7:1 contrast vs `--bg` (was 2.6:1 v1, 4.1:1 v2 — both failed AA 4.5:1). 12-item findings table covers all sampled SCs from WCAG 2.2; 8 items (D1–D8) deferred to next-quarter manual + AT pass scheduled 2026-09. Audit doc `.audit/accessibility/wcag-audit-2026-06-03.md` (formula-calculated luminance + contrast for every colour-pair fix; full methodology + deferred-pass scope + standards mapping including EN 301 549, UK PSBAR, EAA Directive 2019/882, Section 508). `accessibility.html` updated to v2026.06 — conformance section + "resolved" + "known issues (deferred)" sections rewritten. | Closes the only remaining public-sector procurement blocker. First-pass scope is honest: mechanical fixes done; AT-verified conformance scheduled. Next-quarter pass needs Playwright + a real browser + manual NVDA / VoiceOver runs (not session-tractable). |

| 2026-06-03 | **Gate 6 advanced 2/6 → 3/6 — MSP / IT Admin role track shipped.** `/module-msp-admin.html` is the third role track to ship (after Manager + DPO from v2026.05). Single page, 10 sub-modules per outline at `.audit/course-quality/role-track-outlines/msp-it-admin.md`: (1) Article 4 obligation to own MSP staff, (2) Article 26 obligation to customers' AI systems, (3) one-baseline-many-customers governance pattern, (4) approved-tool inventory schema + monthly change ritual, (5) 30-day customer onboarding sequence, (6) patch + change management for vendor AI updates (model swaps, feature drops, sub-processor changes), (7) audit-pack handover boundary (what MSP owns vs what customer owns), (8) first-10-minute incident response choreography, (9) white-label posture + Schedule D dependency, (10) 10-question self-marked assessment. Single-page HTML, ~700 lines body, JSON-LD `LearningResource` + `BreadcrumbList`, table-of-contents `nav.toc` with 10 anchor jumps. Wired: `course.html` role-tracks grid (now 3 cards, eyebrow + lede updated to "three role tracks"), `msp.html` (hero CTA now points at track + rollout-guide in sequence), `rollout-guide.html` (MSP audience-card cross-links to track), `llms.txt`, `sitemap.xml`. Outline status flipped to SHIPPED. | The MSP-side track was outline-priority #1 ("ship first, lowest content-research cost"). MSP-first commercial motion now has a complete enablement spine: track → rollout guide → 6 templates → SCORM/xAPI packaging. RORtech-equivalents can self-serve onboarding. |

| 2026-06-03 | **Gate 11 closed — 30-day rollout guide shipped.** `/rollout-guide.html` is the dual-audience adoption playbook: internal managers AND MSP partners. Structure = preparation (week 0) + launch (week 1, includes sample sponsor kickoff message) + completion drive (week 2) + assessment & cert (week 3) + embed & handover (week 4). Includes: 7-role responsibility matrix with time-per-week estimates; sample sponsor kickoff message; 7-KPI scoreboard (completion / pass-rate / AUP / register / incidents / time-to-escalate / refresh); 9-row common-pitfalls table; 8-item end-state artefact checklist. Each week has an MSP-variant purple callout (multi-customer cohort cadence, staggered kickoffs, per-customer registers, white-label posture, customer-side sponsor protection). JSON-LD `HowTo` with 5 step IRIs. Wired into `course.html` (callout pre-"How to use this course"), `msp.html` (CTA line under lede), `llms.txt` (new "Rollout" section + lede bump to "6 templates + 30-day rollout guide"), `sitemap.xml`. Procurement-gate state: only gate 6 (role-tracks-build) remains in quarter-one block. | Smallest enabler for MSP-first commercial motion: gives every Founding MSP Partner an out-of-the-box per-customer rollout playbook that produces an audit binder, reducing onboarding friction from "we need to figure this out" to "we run this 4-week plan". |

Append below as decisions land. Use `/aos-log` for global cross-project decisions.

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
