# Module Refinements (M6–M11) + Module 2 Video Transitions — Spec

> **Created:** 2026-06-15 · for handoff to a fresh `/build` session
> **Project:** AI Safe@Work (`~/projects/ai-safe-at-work`)
> **Deploys:** Netlify API only (`aisafework.netlify.app`), NOT git auto-deploy
> **Doctrine:** all changes must obey `DOCTRINE.md` — see "Doctrine guardrails" below.

## Objective

Two independent work-streams, both content-accuracy / polish (no new features):

1. **Module 2 explainer video** — add breathing-room pauses at three scene
   transitions and a proper intro to the "four versions" segment.
2. **Modules 6–11 HTML** — apply a legal-accuracy wording pass: soften
   over-broad legal claims, add governance-insight callout boxes, and add a
   few audience/scope clarifications. All wording supplied verbatim below.

## User & Context

- **Who:** Founder of AI Safe@Work, reviewing shipped content for legal defensibility before wider distribution.
- **Why now:** Several statements across M6–M11 overstate legal positions (GDPR "right to explanation", "indistinguishable from real", "72-hour clock starts when you notice"). These are difficult to evidence and create credibility/liability risk with the procurement/DPO audience. The video transitions feel abrupt.
- **Pain if not done:** Procurement/DPO reviewers spot the overstatements → credibility hit on the exact audience the wedge targets.

## Doctrine guardrails (apply to every change)

- **Periwinkle/Carbon "Audit Dossier" visual language.** Structural accent periwinkle `#91a2ff`; body ink silver; headings single-colour (never coloured emphasis). Signals: green = practice/pass, red = caution/prohibited, blue = sector.
- **Governance Insight boxes** use the existing `.callout.govern` pattern (grey "G" icon, "Governance Insight" title, `ISO/IEC 42001` chip via `::after`). Match how they already appear in module-2.html.
- **Standards land in callouts, not prose.** Plain English first.
- **Static HTML only** — no React/Vue/Tailwind/build step.
- **Print survives** (M11 especially must print clean).
- **Cache-buster discipline:** bump `?v=N` on any touched `assets/*.css` / `*.js`. (Current: style.css?v=10, cinema.js?v=8.) HTML content edits don't need a bump but the video re-render does (module-2.mp4?v=2, poster ?v=2).
- After changes: commit, push, deploy via Netlify API, verify live.

---

## WORKSTREAM A — Module 2 video transitions

**Project:** `video-m2/` (Remotion, mirrors `video-m1/`). Render command:
`npx remotion render Module2 out/module-2.mp4 --codec h264` (needs local Node at
`$HOME/tmp/node-v22.14.0-darwin-arm64/bin`). Narration already rendered with
ElevenLabs (voice `lUTamkMw7gOzZbFIwmq4`); audio MP3s + caption JSON exist under
`video-m2/public/voiceover/m2/`. **Do NOT regenerate audio** unless narration
text changes (it does for one scene — see A4).

Scenes in order (`video-m2/src/script.ts`): 01-intro, 02-five-questions,
03-free-version, 04-paid-version, 05-team-enterprise, 06-trained-on,
07-postcard, 08-takeaway.

Timing is driven by `TAIL` in `video-m2/src/Root.tsx` (currently
`Math.round(0.5 * FPS)` = 15 frames / 0.5s after each scene's narration).

### A1. Gap + intro at ~0:52 (five-question test → four versions)
The transition from scene 02 (five-question test) into the version segment is
abrupt and the "four versions" segment has no intro. Two fixes:
- **Add a longer pause** after scene 02 specifically (more than the default 0.5s TAIL — target ~1.0–1.2s of held frame before the next scene).
- **Add a short SPOKEN intro beat to the version segment** (founder confirmed: spoken, not silent title card). Insert a new scene before `03-free-version` — id `02b-versions-intro` (or similar), with its own ElevenLabs narration clip. Narration text: *"Now, the four versions of an AI tool — from weakest to safest."* Title card on screen: "The four versions — weakest to safest." This means **regenerating one audio clip + caption JSON** for the new scene via ElevenLabs (voice `lUTamkMw7gOzZbFIwmq4`; needs `ELEVENLABS_API_KEY` in `video-m2/.env` — founder has supplied this before). Add the new scene to `script.ts` SCENES array in order; the existing per-scene duration logic in `Root.tsx` will pick up its audio length automatically.

### A2. Pause at ~2:32 (versions → "Trained on" segment)
Add extra hold (~1.0s) at the transition from scene 05-team-enterprise into
06-trained-on.

### A3. Pause at ~3:10 (into the segment that follows — postcard/takeaway)
Add extra hold (~1.0s) at the transition around 3:10 (07-postcard or 08-takeaway
boundary — confirm exact scene by checking rendered timecodes).

### A4. Implementation approach for per-transition pauses
The current single global `TAIL` adds the same gap everywhere. Options (builder picks cleanest):
- Convert `TAIL` into a **per-scene tail array** so specific transitions (after 02, after 05, after 07) get a larger value (~30–36 frames) while others keep 15.
- OR add explicit hold/title-card sequences between those scenes.
Preferred: per-scene tail array keyed by scene id, so the longer pauses are
declarative and easy to tune.

### A5. Re-render + redeploy video
- Re-render `module-2.mp4`, regenerate poster (`npx remotion still Module2 ... --frame=140`).
- Copy to `assets/video/module-2.mp4` + `module-2-poster.jpg`.
- Bump embed cache-buster in `module-2.html` to `?v=2` (video + poster).
- Commit, push, deploy, verify live byte size + 200.

---

## WORKSTREAM B — Module wording pass (M6–M11)

All edits are find-and-replace or callout-additions in the existing HTML files.
Preserve surrounding markup, classification chips, and citations. Where a
"Governance Insight box" is requested, use the `.callout.govern` pattern.

### Module 6 — `module-6.html` (AI-powered scams)
1. **Phishing stat — replace:** "Half the phishing you see this year was written, edited or refined by AI" → **"A significant and growing proportion of phishing attacks are now written, edited or enhanced using AI."**
2. **Deepfake section — replace:** "indistinguishable from real" → **"increasingly difficult to distinguish from real"**.
3. **GDPR section — replace:** "the 72-hour clock starts when you notice" → **"organisations may have reporting obligations once they become aware of a personal data breach."**
4. **EU AI Act section — clarify:** transparency obligations apply in specific circumstances and do **not** automatically prevent criminal misuse. (Reword the relevant sentence to say this.)
5. **Add Governance Insight box:** *"Social engineering remains primarily a human problem. AI increases the scale, quality and speed of attacks, but governance, awareness, verification processes and strong authentication remain the most effective controls."*
6. **Add brief BEC reference:** mention business email compromise (BEC) as one of the most common and costly AI-enhanced fraud scenarios affecting organisations today (short paragraph or callout, near the scams/deepfake content).

### Module 7 — `module-7.html` (bias / high-risk decisions)
1. **Soften — replace:** "any AI system used in this category counts as high-risk under the EU AI Act" → **"certain AI systems used in these categories may be classified as high-risk under the EU AI Act, depending on how they are used."**
2. **Replace:** "the rules now apply to that activity" → **"additional governance, oversight and compliance obligations may apply."**
3. **"It's just a draft" section — clarify:** the risk is not the use of AI itself, but allowing AI-generated recommendations to influence decisions **without appropriate review and challenge.**
4. **Stereotyped imagery section — add reminder:** image-generation models are improving but still require human review for representation, diversity and appropriateness.
5. **GDPR Article 22 reference — clarify:** it applies to **certain automated decisions that produce legal or similarly significant effects**, not all AI-assisted decisions.
6. **Add Governance Insight box:** *"Bias management is not about removing all bias from AI. It is about identifying potential sources of unfairness, applying appropriate controls and ensuring accountability for decisions."*
7. **Add "procurement" as an example audience** (vendor selection / AI procurement increasingly fall within governance and risk frameworks).

### Module 8 — `module-8.html` (copyright / ownership)
1. **Soften — replace:** "fully AI-generated material with no significant human creative input cannot be copyrighted" → **"…may not qualify for copyright protection in many jurisdictions."** (legal position evolving, varies by country).
2. **Remove or soften:** "The same applies to derivative versions." (can be challenged depending on level of human contribution).
3. **Input copyright section — avoid "definitely a problem"** categorisation; use **"high risk"** or **"likely to create legal, contractual or confidentiality concerns."**
4. **Output section — clarify:** ownership, authorship and copyright are **separate legal concepts** and may be treated differently by jurisdiction.
5. **Replace** the too-broad "AI-generated blog posts have no copyright protection" → **"The extent of copyright protection may depend on the level of human creative contribution."**
6. **Search-engine section — replace:** "pure AI content is treated as lower-quality in practice and often deranked" → **"Search engines increasingly focus on quality, originality, expertise and usefulness rather than how content was created."**
7. **Add Governance Insight box:** *"The key question is often not 'Can we use AI-generated content?' but 'Can we demonstrate ownership, licensing rights, provenance and appropriate review?'"*
8. **Add trademarks/brands note:** AI-generated content can unintentionally reproduce protected logos, brands, product names or trade dress — separate risks from copyright.

### Module 9 — `module-9.html` (logging / accountability)
1. **Soften GDPR "right to explanation"** — replace "GDPR's right to explanation (Article 22)" → **"GDPR Article 22 provides protections relating to certain automated decision-making, alongside transparency obligations under Articles 13–15."**
2. **Replace:** "ISO/IEC 27001 has long required logging of activities that affect information systems" → **"ISO/IEC 27001 includes controls relating to logging, monitoring and accountability."**
3. **"What counts as significant" section — add:** *"Does the output influence a regulatory, compliance or audit-related activity?"*
4. **Minimum log section — add column/field:** **"Outcome / Status"** (e.g. Used, Rejected, Escalated, Further Review Required) — useful audit evidence.
5. **Article 22 section — replace:** "the obligation to be transparent about how AI was involved still applies" → **"transparency and accountability obligations may still apply depending on the circumstances."**
6. **"Beware the AI decided" section — clarify:** accountability remains with the **organisation and decision-maker, not the AI system.**
7. **Logging vs Surveillance section — add Governance Insight:** *"The purpose of logging should be accountability, traceability and continuous improvement — not employee performance monitoring."*
8. **Mention RoPA** (Records of Processing Activities) slightly earlier — many compliance/DPO readers recognise it immediately.

### Module 10 — `module-10.html` (incident response)
1. **Replace** "72-hour breach clock" → **"potential 72-hour breach notification requirement"** (in the few places it appears — not every incident is reportable).
2. **Category 1 — soften:** "customer records pasted into ChatGPT" → **"customer records pasted into an unapproved AI tool"** (consistent with earlier consumer-vs-enterprise distinction).
3. **GDPR section — replace:** "The clock starts then. Three calendar days, not three working days." → **"The 72-hour notification window runs continuously, including weekends and holidays."**
4. **Category 2 — add:** *"Assess whether any downstream decisions, reports or communications were influenced by the inaccurate output."*
5. **Category 3 — add note:** organisations should follow their **existing cyber incident response process** where one exists, rather than creating a separate AI-only process.
6. **Category 4 — add response items:** reviewing DPAs; reviewing contractual obligations; assessing supplier risk.
7. **Incident note template — add field:** **"Current impact / known consequences"** (often the first question incident managers ask).
8. **Add Governance Insight box:** *"The goal of incident response is containment, evidence preservation, assessment and learning — not assigning blame."*

### Module 11 — `module-11.html` (standards map / checklist) — **print-clean required**
1. **Replace:** "They contradict each other in places" → **"They overlap and approach similar risks from different perspectives."**
2. **Regulation vs Standard section — remove "criminal liability"** unless referring to specific national law; use **"regulatory penalties and enforcement actions."**
3. **GDPR Article 22 — avoid broad "right to explanation":** use **"Rights relating to certain automated decision-making, alongside transparency obligations."**
4. **EU AI Act section — soften:** "This applies to a lot of marketing and customer-service use." → **"Certain marketing, chatbot and synthetic-content use cases may attract transparency obligations."**
5. **Article 50 section — soften:** "AI-generated text on matters of public interest must be marked." → reword to note transparency requirements are **more nuanced and continue to evolve through implementation guidance.**
6. **ISO 42001 Annex A section — avoid exact count:** replace "10 areas" phrasing with **"Annex A includes AI-specific controls covering areas such as…"**
7. **Add Governance Insight box:** *"The standards are not separate compliance exercises. Together they provide a framework for managing data, security, risk, accountability and AI governance."*
8. **Add brief mention of Cyber Essentials / Cyber Essentials Plus and NCSC guidance** — many UK SMEs recognise these more readily than ISO 42001.

---

## Governance templates — STATUS NOTE (likely no action)

The 11 governance templates the founder listed already exist under `templates/`:
`aup-template.html`, `ai-tool-register.html`, `ai-risk-register.html`,
`incident-form.html` (AI Incident Response), `ai-governance-charter.html`,
`ai-raci-matrix.html`, `vendor-questionnaire.html` (AI Vendor Due Diligence),
`ai-use-case-register.html`, `training-register.html`,
`ai-governance-scorecard.html`, `ai-executive-brief.html` (Executive).

**Action for builder:** verify each renders in current Periwinkle/Carbon style,
has JSON-LD + canonical URL, prints clean, and is wired into `course.html`
Templates section + `sitemap.xml`. Only fix drift; do not recreate.

---

## Explicitly out of scope (this spec)

- No new modules or new templates (templates already exist).
- No changes to the visual design system, theme toggle, or parallax.
- No re-translation of FR/DE shells.
- No backend / certificate-verification work.
- Videos for modules other than M2.

## Definition of Done

**Video (Workstream A):**
- [ ] Noticeable pause (~1s+) before the four-versions segment (~0:52), with a NEW SPOKEN intro scene ("Now, the four versions of an AI tool — from weakest to safest.") — new ElevenLabs clip + caption JSON + title card.
- [ ] Extra pause (~1s) at the versions → "Trained on" transition (~2:32).
- [ ] Extra pause (~1s) at the ~3:10 transition.
- [ ] `assets/video/module-2.mp4` + poster re-rendered, embed bumped to `?v=2`, live and playing.

**Wording (Workstream B):**
- [ ] All M6 edits (6 items) applied; BEC mentioned; Governance Insight box present.
- [ ] All M7 edits (7 items) applied; procurement audience added; Governance Insight box present.
- [ ] All M8 edits (8 items) applied; trademark note + Governance Insight box present.
- [ ] All M9 edits (8 items) applied; Outcome/Status field + RoPA mention + Governance Insight box present.
- [ ] All M10 edits (8 items) applied; incident-note "Current impact" field + Governance Insight box present.
- [ ] All M11 edits (8 items) applied; M11 still prints clean; Cyber Essentials/NCSC mentioned; Governance Insight box present.
- [ ] No coloured heading emphasis introduced; Governance Insight boxes match existing `.callout.govern` styling.

**Ship:**
- [ ] Committed, pushed, deployed via Netlify API, verified live (spot-check 2–3 changed strings via `curl`).
- [ ] Doctrine decision-log row added noting the M6–M11 legal-accuracy pass + M2 video transition fix.

## Notes for the builder

- Search exact source strings first (`grep -n "old phrase" module-N.html`) — some phrasing may differ slightly from the founder's paraphrase; match intent.
- The founder's overall verdict on the M2 video was "awesome" — transitions are the only video change; don't restyle scenes.
- Governance Insight box reference implementation is in `module-2.html` (search `callout govern`).
- Netlify deploy uses the MCP `netlify-deploy-services-updater` → returns an `npx @netlify/mcp ... --proxy-path` command run with local Node on PATH. The MCP's final status check sometimes reports a false 502/fetch-failed; verify the real state via `netlify-project-services-reader` (`currentDeploy.state: ready`) and a live `curl`.
