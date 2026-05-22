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
| 1 | **Standards Map annex** — clause-to-module table (EU AI Act Art 4, ISO 42001 7.2 / A.4.5, ISO 27001 A.6.3) | First doc procurement asks for | 2 hr | TODO |
| 2 | **Knowledge checks per module** (5 MCQ, stored in localStorage, score-exportable) | Audit-grade evidence of comprehension | 1 day | TODO |
| 3 | **Completion certificate w/ unique ID + verifiable URL** | Audit trail | 1 day | TODO |
| 4 | **SCORM 1.2 + xAPI export wrapper** | LMS deployment (Moodle, Workday, Cornerstone, 365 Learn) | 1 week | TODO |
| 5 | **FR + DE translations** (EN done) | EU literacy obligation, member-state language | 2–4 wk per language | TODO |
| 6 | **Role-based tracks** (board, manager, IC, DPO, dev) | Different roles → different obligations | 2–3 wk | TODO |
| 7 | **Templates pack** (DPIA, FRIA, AUP, incident form, training register, vendor questionnaire) | Procurement loves "in the box" | 2 wk | TODO |
| 8 | **WCAG 2.2 AA audit + fixes** | Public sector + DDA compliance | 1–2 wk | partial — needs audit |
| 9 | **Quarterly versioned changelog + RSS** | "Updated content" signal | 1 wk | TODO |
| 10 | **Sector overlays — finance, healthcare, public-sector first** | Each unlocks a vertical sales motion | 3–6 wk each | TODO |
| 11 | **Manager / trainer rollout guide** | Internal adoption aid | 1 wk | TODO |
| 12 | **HTTPS + production domain** | Required for any serious deployment | <1 day | TODO |
| 13 | **JSON-LD (`Course`, `LearningResource`, `FAQPage`, `BreadcrumbList`) + sitemap.xml + robots.txt + llms.txt** | Discoverability + AI-citation engines | 2 hr | TODO |
| 14 | **OpenGraph + Twitter card meta per page** | Social / chat sharing | 1 hr | TODO |
| 15 | **Accreditation partnership for CPD / CPE credit** (IAPP, ISACA, ISC2) | Cert maintenance buyers | multi-month, external | TODO |

Gates 1, 2, 3, 13, 14 are the **week-one block**. Gates 4–7 are the **quarter-one block**.

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

### Open TODOs

- [x] robots.txt with training-vs-citation split — shipped 2026-05-19
- [x] tdm-policy.json — shipped 2026-05-19
- [ ] Page-level `noai, noimageai` meta tags on `pricing.html` (since it's currently the closest thing to a paid surface)
- [ ] `X-Robots-Tag: noai, noimageai` header on paid responses — needs hosting w/ header control (Cloudflare Pages: `_headers` file)
- [ ] `.audit/security/canary-tokens.md` rotation log
- [ ] Cloudflare Pages + Bot Management decision
- [ ] Public-facing `/security.html` posture statement
- [ ] Quarterly re-review of citation vs training UA split per `refresh-cadence.md`

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

Append below as decisions land. Use `/aos-log` for global cross-project decisions.

---

## Related

- [[ai-safe-at-work]] — project index
- [[../win2linux-course/doctrine|win2linux doctrine]] — sibling project, shared design DNA
- Repo: `~/.openclaw/workspace/ai-safe-at-work/`
- Static site: TBD canonical domain
- Audit source: see Chief-of-Staff session transcripts 2026-05-19

#project #doctrine #ai-safety #compliance #eu-ai-act #iso-42001 #iso-27001 #gdpr
