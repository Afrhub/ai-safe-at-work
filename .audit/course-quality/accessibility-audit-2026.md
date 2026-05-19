# Accessibility audit — 2026

> **Auditor:** Founder (self-assessment) · **Date:** 2026-05-19 · **Target:** WCAG 2.2 Level AA · **Method:** manual heuristic + DOM inspection · **Status:** initial baseline

## Conformance summary

Self-assessed **partially conformant**. Strong on semantics, contrast, motion-reduce; gaps on focus styles, skip-link, and external screen-reader testing.

## What was checked

- HTML semantics (landmark elements, heading hierarchy, list-where-list).
- Colour contrast at body, headings, links (manual eyeball + WCAG ratios).
- Keyboard reach of every interactive element.
- `prefers-reduced-motion` handling.
- Print stylesheet.
- No autoplay / no time limits / no captcha.
- Mobile responsive (320px viewport up).

## Findings

| ID | Severity | Issue | Pages affected | Fix planned |
|---|---|---|---|---|
| ACC-01 | Medium | Focus styles inherit browser default; not always visible against dark background | All | Custom high-contrast focus ring in next quarterly |
| ACC-02 | Medium | No skip-to-content link | All | Add `<a class="skip-link">` as first element of `body` |
| ACC-03 | Low | Some long sentences increase cognitive load | Some module text | Acceptable trade-off for adult-professional audience; flagged in public statement |
| ACC-04 | Medium | No external screen-reader audit | All | Schedule for next quarterly |
| ACC-05 | Low | No manual motion-off toggle for users who don't have `prefers-reduced-motion: reduce` set | All | Consider for next quarterly |
| ACC-06 | Low | No alternative formats (audio summary, very-plain-English version) | All | Roadmap item; not blocking |

## What passed

- Heading hierarchy: every page starts with `h1`, no level skips.
- Landmark elements: `header`, `main`, `footer`, `nav` used consistently.
- Body text contrast against `--bg #060608`: text `--text #eef2f7` ratio ~17.6:1 (well above 4.5:1 minimum).
- Accent links against `--bg`: `--accent #e8a726` ratio ~11.3:1 (well above 4.5:1).
- Press feedback on every interactive element.
- Cinema background respects `prefers-reduced-motion`.
- Print stylesheet hides cinema-bg, reading-progress, and topbar; preserves all content.
- Mobile viewport tested at 320px, 375px, 768px, 1024px, 1440px.

## Next steps (committed)

1. Implement focus-style + skip-link in next quarterly release.
2. Commission external screen-reader audit (NVDA + VoiceOver minimum) before any procurement push.
3. Add manual motion-off toggle to gate page; persist preference to localStorage.

## Re-audit cadence

Quarterly heuristic; annual full audit; ad-hoc after any structural change to layout, navigation, or interactive surfaces.
