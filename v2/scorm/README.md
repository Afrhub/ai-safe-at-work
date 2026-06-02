# SCORM 1.2 package — deployment guide

> Closes `DOCTRINE.md § Procurement-readiness gates → Gate 4 — SCORM 1.2 + xAPI export wrapper`.

This folder contains the SCORM 1.2 manifest + metadata that wrap the v2 course as a single uploadable LMS package.

---

## What this is

A standards-compliant SCORM 1.2 Content Aggregation that:

- Bundles the v2 course (HTML + CSS + JS + JSON manifest) as a single SCO.
- Reports completion + score + suspend-state back to any SCORM 1.2-compatible LMS (Moodle, Cornerstone, Cornerstone OnDemand, Workday Learning, Bridge, Docebo, LearnUpon, Litmos, TalentLMS, SCORM Cloud, etc.).
- Falls back transparently to plain browser playback if no SCORM API is found in the parent window chain (the same package is usable as a standalone learning artefact).
- Co-exists with xAPI: if the LMS supports xAPI, the xAPI adapter fires statements in parallel.

## Build the upload .zip

From repo root:

```bash
python scripts/build-scorm.py
# Output: dist/ai-safe-at-work-scorm-v2.zip
```

The script copies every file the manifest references plus the manifest itself into a clean staging dir and zips it.

## Upload to an LMS

### Moodle 3.9+ / 4.x

1. Settings → Course Administration → Add an activity → SCORM package.
2. Upload `ai-safe-at-work-scorm-v2.zip`.
3. Set **Width** = 100%, **Height** = 100%, **Display package** = New window for best results.
4. Grading method = Highest grade. Maximum grade = 100. Attempts unlimited.

### Cornerstone OnDemand

1. Reports → Standard Content → Upload SCORM. Pick the zip.
2. Set **Compatibility** = SCORM 1.2.
3. Mastery score is read from the manifest (80%). Override only if buyer prefers different threshold.

### Workday Learning

1. Create Course → Upload SCORM Lesson.
2. Upload zip. Workday detects 1.2 from the manifest.
3. Set version. Activate. Assign to learners through normal Workday workflows.

### SCORM Cloud (testing / certification)

1. Upload zip.
2. Click "Launch". Verify cmi.core.lesson_status flips to `passed` or `completed` when the learner finishes module 11.
3. Verify cmi.core.score.raw matches what the user scored on the final assessment in module 11.

## What the LMS will see

| SCORM 1.2 field | Value emitted by AI Safe@Work |
|---|---|
| `cmi.core.student_id` | (read-only, supplied by LMS) |
| `cmi.core.student_name` | (read-only, supplied by LMS) |
| `cmi.core.lesson_status` | `incomplete` on first launch · `completed` when all 11 modules marked · `passed` when final assessment ≥ 80% · `failed` when final assessment < 80% |
| `cmi.core.lesson_location` | Last-visited module ID (`1` to `11`) |
| `cmi.core.score.raw` | 0–100. Set from final-assessment score in module 11. |
| `cmi.core.score.min` | 0 |
| `cmi.core.score.max` | 100 |
| `cmi.core.session_time` | HH:MM:SS for current session |
| `cmi.core.total_time` | aggregated across sessions |
| `cmi.suspend_data` | JSON: `{"version":1,"completed":[1,2,...],"locale":"en\|fr\|de","score":NN}` |
| `cmi.core.exit` | `suspend` on every Mark-complete · `` (empty) on final-assessment complete |

## What changes between buyers

Nothing. The package is buyer-neutral. Locale defaults to `en`; learners can switch to `fr` or `de` from inside the course.

Custom buyer branding requires the Strategic-tier white-label SKU (per `.audit/legal/msp-tier-feature-matrix.md`) and is delivered as a separately built package.

## Testing

Tested manually against SCORM Cloud reference player on 2026-06-02. Test session:

- Launched SCORM package.
- Started → walked all 11 modules → marked each complete → final assessment 8/8.
- Result: `cmi.core.lesson_status = passed`, `cmi.core.score.raw = 100`.
- Suspended midway through module 6, closed window, reopened → resumed at module 6 with prior completion intact.

Re-test on every commit that touches `v2/assets/scorm-api.js`, `v2/assets/v2.js`, or `v2/scorm/imsmanifest.xml`.

## Open items

- Cornerstone-specific extension fields (cmi.interactions for question-level reporting) — deferred until first Cornerstone customer asks. Would require module 11 to emit per-question interactions.
- Auto-generated PDF certificate hand-off — the SCORM session pushes `score.raw` to the LMS but does not currently push the printable certificate. Roadmap: emit `cmi.suspend_data.certURL` and let the LMS surface a link.
- xAPI-only LMSs (Watershed, Learning Locker) — handled by `assets/xapi-adapter.js` independently of this SCORM 1.2 wrapper. See `.audit/integrations/xapi-statements-spec.md`.

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-06-02 |
| Verdict | Standards-compliant, smoke-tested against SCORM Cloud reference player. Ready for Moodle / Cornerstone / Workday upload. | — |
| Next review | First customer-facing LMS deployment OR Q3 2026 quarterly refresh, whichever is sooner. | — |
