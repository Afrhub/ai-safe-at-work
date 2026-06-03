# Translator vendor sourcing — FR + DE native-speaker review pack

> Closes DOCTRINE.md procurement-gate 5 ("FR + DE translations") finishing
> step. Shells shipped 2026-06-03 commit `310daf6` with machine-translation
> banner. This pack enables the user to take the next commercial step:
> select + procure native-speaker review of the FR + DE shells.
>
> This is **pre-procurement work**, not the review itself. The deliverable
> is a vendor shortlist + RFQ template + acceptance criteria. The user
> takes it to vendors.

## What this pack contains

1. Scope statement (what's being reviewed)
2. Quantity + word-count breakdown
3. Vendor shortlist by quality tier
4. RFQ template ready to send
5. Acceptance criteria + sample quality bar
6. Budget guidance + procurement workflow
7. Post-review integration plan back into the repo

## 1. Scope statement

**Source material:** the EN canonical AI Safe@Work v2 course at
`v2/index.html`, `v2/course.html`, `v2/module-1.html` … `v2/module-11.html`
(13 EN files; total ~30,000 words).

**Existing target language coverage:**

| Locale | Path | Status | Banner |
|---|---|---|---|
| EN | `/v2/` | Canonical | n/a |
| FR | `/v2/fr/` (13 files) | Machine-draft, awaiting native review | "FR · Traduction automatique en attente de relecture native." |
| DE | `/v2/de/` (13 files) | Machine-draft, awaiting native review | "DE · Maschinelle Übersetzung — wartet auf muttersprachliche Prüfung." |

**Out of scope this engagement:**
- v1 modules + role tracks + templates (EN-only, not on i18n roadmap yet)
- SCORM manifest XML strings (separate procurement step if SCORM rolled to FR/DE LMS)
- xAPI verb / object / activity-name display strings (handled inside LMS, not files)
- Marketing copy on `index.html`, `course.html` outside the v2 path
- FAQ + standards-map narrative

## 2. Quantity + word-count breakdown

Estimated word counts based on EN source (FR/DE typically 15-30% longer in target):

| File | EN words (approx) | FR target words (approx) | DE target words (approx) |
|---|---|---|---|
| `v2/index.html` | 250 | 290 | 310 |
| `v2/course.html` | 200 | 230 | 250 |
| `v2/module-1.html` | 1,400 | 1,610 | 1,750 |
| `v2/module-2.html` | 1,300 | 1,500 | 1,625 |
| `v2/module-3.html` | 1,500 | 1,725 | 1,875 |
| `v2/module-4.html` | 1,400 | 1,610 | 1,750 |
| `v2/module-5.html` | 1,300 | 1,495 | 1,625 |
| `v2/module-6.html` | 1,500 | 1,725 | 1,875 |
| `v2/module-7.html` | 1,400 | 1,610 | 1,750 |
| `v2/module-8.html` | 1,300 | 1,495 | 1,625 |
| `v2/module-9.html` | 1,500 | 1,725 | 1,875 |
| `v2/module-10.html` | 1,000 | 1,150 | 1,250 |
| `v2/module-11.html` | 1,500 | 1,725 | 1,875 |
| **Totals** | **~15,550** | **~17,890** | **~19,435** |

**Per-locale review wordcount (the actual billable):** ~17,890 for FR,
~19,435 for DE. Total target words ~37,325.

**Source material per locale already exists in repo** — the translator
edits the machine-drafted FR / DE rather than translating from EN. This is
**revision work**, not full translation. Most agencies charge revision at
~50-60% of full-translation rate.

## 3. Vendor shortlist by quality tier

### Tier 1 — Specialist legal / compliance translation agencies

These are the right choice when you sell into EU procurement / public
sector and the deliverable needs to defend audit-grade language. Pricing:
£0.18-£0.30 per source word for revision; £0.30-£0.50 for translation.

| Vendor | Country | Why | Web |
|---|---|---|---|
| Lionbridge Legal | global, EU offices | scale + legal-specialist tier; ISO 17100 certified | lionbridge.com |
| RWS / Trados | UK + global | enterprise-grade; ISO 17100; legal + life-sciences specialist | rws.com |
| TransPerfect | global | legal + financial-services specialist; ISO 17100 | transperfect.com |
| Acolad | France + global | EU-headquartered; legal translation specialist | acolad.com |
| Welocalize | UK + global | tech + legal hybrid; certified | welocalize.com |

### Tier 2 — Mid-market boutique with subject-matter specialisation

Right for first-pass review when budget is tight and the content is
not yet revenue-producing. Pricing: £0.10-£0.18 per source word for
revision; £0.15-£0.25 for translation.

| Vendor | Country | Why | Web |
|---|---|---|---|
| Veritas Language Solutions | UK | legal + compliance focus; SMB-friendly | veritaslanguagesolutions.com |
| Kwintessential | UK | sector-experienced; smaller minimums | kwintessential.co.uk |
| London Translations | UK | compliance + legal experience; ISO 17100 | london-translations.co.uk |
| Espresso Translations | UK | tech + business focus; transparent pricing | espressotranslations.com |
| TextMaster (now part of Acolad) | France | tech + compliance projects; SMB-friendly | textmaster.com |

### Tier 3 — Freelancer marketplaces with vetted translators

Right for cost-sensitive first-pass review when you can manage the
quality control directly. Pricing: £0.05-£0.12 per source word.

| Marketplace | Approach |
|---|---|
| ProZ.com | Direct freelancer hire; quality varies; check Blue Board ratings |
| TranslatorsCafé | Similar to ProZ; smaller pool |
| Smartcat | Marketplace + workflow; built-in vendor management |
| Gengo | Lower-end on quality; not recommended for legal-adjacent content |

### Tier 4 — In-house relationships (where applicable)

If your MSP partners or customers include FR / DE-speaking firms, in-house
review by their compliance team can be the highest-quality + lowest-cost
route. RORtech Partners (UK) is not this; if Founding Partner #2 turns
out to be a French or German MSP, ask about in-house review as part of
the Founding-tier agreement (zero rev share offset, sweat equity).

### Recommended starting shortlist

Send the RFQ to three vendors across tiers:
1. **One Tier 1** (Acolad or RWS) — benchmark for upper bound on quality + price
2. **One Tier 2** (Veritas Language Solutions or London Translations) — likely sweet spot for first-pass
3. **One Tier 3** (ProZ shortlist of 2-3 freelancers) — lower bound; manage if Tier 2 doesn't bite

## 4. RFQ template (ready to paste-and-send)

```text
Subject: RFQ — native-speaker review of FR + DE machine-translated training course (~37,000 target words)

Hi [Vendor],

We are AI Safe@Work, a free AI-governance training course for EU/UK SMBs
and the MSPs serving them (https://aisafework.netlify.app/v2/).

We have machine-translated the v2 course (11 modules + landing + course
overview, ~16,000 EN source words) into French and German. We are now
seeking native-speaker review of the FR and DE drafts to procurement-
ready quality.

Scope:
- 13 FR HTML files at /v2/fr/ (machine-draft target, ~17,900 words)
- 13 DE HTML files at /v2/de/ (machine-draft target, ~19,400 words)
- Both totalling ~37,300 target words of revision work

Deliverable:
- Edited FR + DE HTML files where the body text reads as natural
  professional French / German for a compliance-and-IT-management
  audience, with no anglicisms in the translation, with consistent
  EU-AI-Act / GDPR / ISO terminology, and with no factual departure
  from the EN canonical
- Track-changes or commented HTML files we can review
- Glossary of locale-specific terminology used so we can re-use it on
  later content

Subject-matter:
- EU AI Act (Regulation 2024/1689) — your reviewer should be
  comfortable with the terminology (déployeur / Bereitsteller / fournisseur /
  Anbieter; high-risk / haut risque / hochriskant; etc.)
- GDPR (Regulation 2016/679)
- ISO/IEC 42001:2023 + ISO/IEC 27001:2022
- General AI safety + governance terminology
- Plain professional EU French / professional Hochdeutsch
  (not Swiss German, not Quebec French)

Reviewer profile we want:
- Native-speaker, EU resident
- Demonstrated compliance / legal / financial-services translation
  history (ISO 17100 desirable)
- Familiar with EU AI Act terminology preferred

Quality bar:
- Procurement-grade — the FR / DE shells must be defensible to an
  EU buyer who reads them in their language and judges them on the
  quality of the language as well as the content
- Banner currently on every page declaring machine-translation status
  will be removed once your review is incorporated
- We expect to publish your reviewed version with attribution
  ("FR / DE reviewed by [Vendor name]") in the page footer if you
  consent

Timeline:
- We'd like your quote by [date + 7 days]
- Engagement start: [date + 14 days] subject to your availability
- Delivery: completed FR + DE within 6 weeks of start

Please quote:
- Per-source-word revision rate (or per-target-word) in GBP
- Total project cost in GBP
- Lead time
- ISO 17100 certification status
- Reviewer profile of the actual person(s) doing the work
- Sample willingness — could you review one module (~1,500 words) as
  a sample at your standard rate so we can evaluate quality before
  committing the full project?

Files:
- All FR + DE files are public on the live site or in our public
  GitHub repository at github.com/Afrhub/ai-safe-at-work
- We can also share the EN canonical for your reference

Thanks,
[Your name]
AI Safe@Work
```

## 5. Acceptance criteria + quality bar

The reviewed deliverable must:

1. **Read natively** — a native FR / DE speaker should not be able to
   tell it was originally machine-translated.
2. **Preserve all EN canonical structure** — same H1 / H2 / H3
   hierarchy, same callout boxes, same sub-module numbering, same TOC
   anchors. Translation, not re-write.
3. **Use consistent EU AI Act terminology per locale**, following the
   French + German versions of Regulation 2024/1689 published in the
   Official Journal of the EU.
4. **Use consistent GDPR terminology per locale**, following the French
   + German versions of Regulation 2016/679.
5. **Preserve all standards citations and references** unchanged
   (ISO/IEC 42001, ISO/IEC 27001, OWASP, etc.).
6. **Preserve all HTML markup, classes, IDs** — no structural change.
7. **Preserve all `<a href>` targets** — internal links unchanged.
8. **Include a per-locale glossary** of the major terms used + their EU
   AI Act / GDPR source.
9. **Pass the sample-module test** before full commitment — one module
   reviewed at the vendor's standard rate; we approve before sending
   the rest.

### Sample-quality bar — short paragraph EN → expected FR / DE

**EN source (Module 1, sub-module 1 lede):**

> Shadow AI is the use of AI systems outside the organisation's
> approved governance, procurement, or security processes.

**Expected FR (illustrative — vendor must do better):**

> L'IA fantôme désigne l'utilisation de systèmes d'IA en dehors des
> processus de gouvernance, d'achat ou de sécurité approuvés par
> l'organisation.

**Expected DE (illustrative — vendor must do better):**

> Schatten-KI bezeichnet die Nutzung von KI-Systemen außerhalb der
> genehmigten Governance-, Beschaffungs- oder Sicherheitsprozesse der
> Organisation.

The vendor's sample should be at this quality or higher. If the vendor's
sample reads as obviously machine-edited or contains anglicisms ("Shadow
AI ist die Nutzung..." for DE, or "AI Shadow est..." for FR), reject
and try Tier 2 / Tier 3 shortlist instead.

## 6. Budget guidance

### Cost calculation

|  | Tier 1 (£0.20/word revision) | Tier 2 (£0.12/word revision) | Tier 3 (£0.08/word revision) |
|---|---|---|---|
| FR (~17,890 words) | £3,578 | £2,147 | £1,431 |
| DE (~19,435 words) | £3,887 | £2,332 | £1,555 |
| **Combined** | **~£7,465** | **~£4,479** | **~£2,986** |
| Project-management margin (15%) | £1,120 | £672 | £448 |
| **All-in (FR + DE)** | **£8,585** | **£5,151** | **£3,434** |

### Recommended initial commit

- Start with Tier 2 sample (£0 — most reputable vendors do a sample at
  cost or free), then ~£2,500-£3,000 for the FR-first batch.
- After FR delivery + review + acceptance, commit to DE at similar
  price.
- Total expected commit: £5,000-£6,000 over ~10 weeks.
- Acceptable upper bound for an MSP-partnership-funded review:
  £8,500 Tier 1 if Founding-Partner cost-sharing applies.

### Funding routes

- **Self-funded** — appropriate if first MSP partner activation hasn't
  happened yet. Treat as marketing / content investment.
- **Founding MSP partner co-fund** — if RORtech Partners has FR / DE
  customer base, propose splitting the £5k Tier-2 cost in exchange for
  6-month right-of-first-refusal on the FR / DE deliverable.
- **MSP-resold pre-sale** — if a Tier-1 EU MSP is in pipeline with FR
  or DE customer commitment, ring-fence their first-year revenue share
  toward the review cost.

## 7. Post-review integration plan

Once the reviewed FR + DE files are received:

1. **Diff-review** — git diff against current FR / DE files; spot-check
   each diff to verify it's the kind of change you expect (not whole
   re-writes).
2. **Smoke test** — local server; navigate the 13 pages in each locale;
   confirm no broken links, no broken HTML.
3. **Remove the machine-translation banner** from each page (the orange
   banner currently saying "machine translation pending native review").
4. **Update `modules.json`** to remove the `nativeReviewPending` array
   entry for the now-reviewed locale.
5. **Add the vendor attribution** to footer (if vendor consented):
   "Translation reviewed by [Vendor]".
6. **Update `accessibility.html` + `changelog.html`** to record the
   v2026.0X release including the language-review completion.
7. **Update DOCTRINE.md gate 5** from "shells, native review pending" to
   "DONE — native review complete".
8. **Bump SEO sitemap entry priority** for the v2/fr and v2/de
   directories once `noindex` is lifted.
9. **Trigger Vercel / Netlify production deploy** automatically on
   merge.

## Audit metadata

- Date: 2026-06-03
- Owner: Alastair Reid (until Founding-tier partner takes over)
- Status: pack ready to send to vendor shortlist
- Next action: user sends the RFQ to three vendors (one each from
  Tiers 1 / 2 / 3)
- Expected completion: 6-10 weeks from RFQ
- Closes: DOCTRINE gate 5 finishing step
