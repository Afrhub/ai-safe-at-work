# Interactive SVG audit — per module (M1–M12)

> Decides, per module, whether an interactive widget that **demonstrates understanding** earns its place against the cost of build + accessibility QA. The rule: include only when interaction proves comprehension that prose can't measure (sorting · sequencing · classifying · decision-tracing).
>
> All widgets must be **keyboard-operable**, **screen-reader-labelled**, and pass `prefers-reduced-motion`. WCAG 2.2 AA conformance does not regress.

---

## Decision rubric

| Question | If yes |
|---|---|
| Is there a finite set the user must **classify** correctly? | → classifier widget (M3-style) |
| Is there a **sequence or timeline** the user must order? | → drag-sort timeline (or click-to-order if drag fails a11y) |
| Is there a **decision tree** with explicit branches? | → tappable flowchart |
| Is there a **fillable artefact** (log entry, checklist, form)? | → fillable form-card with required-field validation |
| Is the content **narrative prose** (stories, principles, definitions)? | → no widget · prose + MCQ only |
| Would the widget add **visual interest without testing comprehension**? | → no widget (gimmick risk) |

---

## Per-module decisions

| # | Module | SVG decision | Type | Rationale |
|---|---|---|---|---|
| 1 | Why this course exists | **Skip** | — | Three narrative incidents. Comprehension is tested by MCQ (who did what, what was the cost). A widget here would be decoration, not assessment. |
| 2 | What AI tools do with what you type | **Build** | **Tier-classifier** | Drag/click 8 features (chat history retention · enterprise SSO · training opt-out · data residency · etc.) onto the correct tier (Free · Paid-individual · Enterprise). Demonstrates the tier table. |
| 3 | The never-paste list | **Built (pilot)** | **Safe/Never classifier** (10 items) | Already shipped. Tests pattern-recognition across the 9 categories using realistic data snippets. |
| 4 | Picking the right tool | **Build** | **Decision flowchart** | Tappable nodes — start at "what kind of data?" branching through tier choice + procurement check + shadow-AI check. User taps the path; widget shows the recommended tool tier at the leaf. |
| 5 | Verifying what the AI tells you | **Build** | **Two-source validator** | User is given a generated claim + a list of source candidates (some real, some hallucinated). User picks the two strongest sources. Demonstrates the two-source rule and source-quality judgement. |
| 6 | AI-powered scams aimed at you | **Build** | **Callback-step picker** | Simulated voice-clone scenario. At each turn the user picks one of four responses. Widget rewards "verify via known channel" responses and explains why each wrong path fails. Demonstrates the callback principle. |
| 7 | Bias, fairness, not embarrassing the business | **Skip** | — | Bias examples are content-rich and contextual. Risk: classifier oversimplifies a topic the module specifically asks the reader to handle nuanced. MCQ + worked-example callouts cover assessment. Revisit if pilot data shows the topic underperforming. |
| 8 | Copyright, IP, and other people's content | **Skip** | — | Largely definitional + jurisdictional. Comprehension is concept-level. MCQ tests adequately. Widget would be a quiz-in-different-clothing. |
| 9 | Logging and accountability | **Build** | **Fillable log card** | SVG-styled log entry form: required fields (date · tool · purpose · data class · output destination · reviewer · approval). User fills it for a worked scenario. Validator highlights missing required fields and explains why each is required for audit. Direct artefact mapping to ISO 42001 A.6.2.6 + EU AI Act Article 12 + GDPR Article 22 evidence. |
| 10 | When something goes wrong | **Build** | **72-hour timeline ordering** | Six events from a breach scenario (detection · containment · GDPR Art 33 notification · DPA escalation · customer comms · post-incident review) presented out of order. User drags or click-arrows them into the right sequence within the 72-hour clock. Demonstrates the GDPR 72-hour mechanics. Keyboard-equivalent: up/down arrows reorder. |
| 11 | The 60-second pre-submit checklist | **Build** | **Wallet-card tick-through** | SVG of the wallet-card checklist itself. Six items, each ticked by the user against a worked scenario at the top of the widget. All-six-correct = "green pass" animation. Single most-used artefact of the whole course — earns extra polish. |
| 12 | The standards behind this course | **Skip** | — | Reference content. Comprehension via MCQ. Already linked to `/standards-map.html` which is its own interactive artefact (sortable + filterable). |

---

## Build plan (post-pilot)

| Phase | Modules | Effort estimate |
|---|---|---|
| Pilot (this session) | M1 (MCQ only) + M3 (MCQ + classifier) | Shipped |
| Phase 2 | M11 (wallet-card tick-through · highest value) + M2 (tier-classifier) | ~3-4 hr |
| Phase 3 | M9 (log card) + M10 (72-hr timeline) — Article-12 + Article-33 evidence widgets | ~4-5 hr |
| Phase 4 | M4 (decision flowchart) + M5 (source validator) + M6 (callback picker) | ~6-8 hr |
| Phase 5 (deferred) | Re-evaluate M7 + M8 + M12 after telemetry | — |

Total ~15-20 hr of focused build for the full interactive layer, excluding accessibility QA.

---

## Accessibility budget per widget

Every widget must ship with:

| Item | Status check |
|---|---|
| Keyboard-only path to completion | Tab + Enter + Space + Arrow keys |
| ARIA labels on every interactive element | `aria-label`, `role`, `aria-live` for verdict regions |
| Visible focus indicator | 2px outline at `--accent` |
| Reduced-motion respected | `@media (prefers-reduced-motion: reduce)` disables animation |
| Colour-blind safe pairing | Pass/fail uses **icon + colour + text**, never colour alone |
| Screen-reader verdict announcement | `aria-live="polite"` on feedback panel |
| Touch target ≥ 44 × 44 px | `padding` enforced in `quiz.css` `.clip-btn`, `.quiz-option` |

---

## EU AI Act Article 4 evidence loop

The widgets are not decoration. They are the literacy evidence:

| Artefact | Evidences |
|---|---|
| MCQ score ≥ 80% (per module) | Comprehension of module body |
| Classifier 10/10 (M3) | Pattern-recognition under realistic prompts |
| Log-card fill (M9) | Operational competence with the logging requirement itself |
| Wallet-card tick (M11) | The pre-submit ritual is internalised |
| Certificate PDF (per module) | Auditable record kept by the learner; reproducible by retake |

Combined: an employer can show an auditor that staff have **read · classified · sequenced · filled-in** the artefacts the regulator expects them to use. That is what Article 4 literacy looks like in practice.

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-05-27 |
| Decision authority | Founder (solo operator) | 2026-05-27 |
| Refresh | Annual, or sooner if accessibility audit flags a widget |
