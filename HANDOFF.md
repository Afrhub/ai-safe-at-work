# HANDOFF — Attest AI / ai-safe-at-work

Updated: 11 Aug 2026 · Everything committed, pushed and live. `git log -1` for the head.
Supersedes the 26 Jul version. Full decision history in DOCTRINE.md; this file is the cold resume.

## What this is
Static site + Supabase (`hanjrsslhnuauaysbhun`) selling AI governance to UK/EU SMEs and MSPs.
Live at **aisafework.netlify.app**. **git push = deploy** (Netlify site `89ac5015-…`).
Pre-push hook validates JSON-LD and blocks secrets + forbidden files.

Module 12's video was re-rendered and deployed: it narrated the pre-Omnibus Article 4
wording. 80.2s to 88.5s, because the corrected line is longer and the composition sizes
itself from the audio.

## Current state

**Auth is ARMED (changed 31 Jul).** `AUTH_DISABLED = false` in `portal/assets/portal.js`. The demo
password was rotated out of the repo; `DEMO.password` is now `""` so flipping the flag back fails
closed. `/portal/manager.html` bounces a signed-out visitor to sign-in. Do not set it back to true.

**Payments built, inert.** Stripe Bacs Direct Debit via `netlify/functions/create-checkout-session.mjs`
and `stripe-webhook.mjs`, no SDK (REST over fetch, no package.json). Both return 503 until
`STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` exist, and the checkout page falls back to the Netlify
order form, so the button is never dead. Price is resolved server-side by `resolveBand(plan, headcount)`
— **plan AND band**, because `checkout.js` reuses the band keys `1-25`/`26-50` for Platform at
different prices. Buyer can nominate a different manager at checkout (`manager_email`).

**Nav is three sections + Sign in** (3 Aug): Products · Course · Governance · [Sign in]. Who We Help,
Plans, Book a Demo and Become a Partner moved to a footer **Explore** column. New pages: `governance.html`
(public Governance Centre overview) and `demo.html` (dedicated Book a Demo page).

**Course page lists only Module 1**, as a clickable card to the free ungated page.

**Quizzes for modules 2 to 12 are scored by the database (11 Aug).** `quiz_keys` seeded with
120 rows by migration 0008; `record_quiz_result` extended to return per-question results;
`quiz.js` submits once at the end straight to the RPC with the learner's own token, so
`module_progress` and `audit_log` are finally written. The answer key is gone from those 11
pages. Deliberately excluded: module 1 (free, ungated, no session to score against) and the
9 string-id quizzes. Verified live as a signed-in user, 1/10 on wrong answers, nothing
written because it did not pass.

**Test suites, ~120 checks.** `node tests/run-all.mjs`. Suites: pricing logic, webhook signature,
manager nomination, exposure/headers, public site, authorisation (RLS), browser (Playwright).
Browser suite resolves Playwright from `~/projects/mlr` via `createRequire`.
**All suites green against live, 11 Aug evening: 226 passed, 0 failed.** The 13 skips are
by design (destructive form posts, RLS checks needing credentials). CSP-01 now covers every
module and sector page signed in, not a 12-page sample. Run against a local server and the
exposure, header and redirect checks fail: those rules live in `netlify.toml`/`_headers`,
not in the files.

**Docs worth reading before touching anything:** `docs/ACTION-ITEMS.md` (34 items, P0→P4),
`docs/USER-JOURNEYS.md` (three roles + the roles that have no row), `docs/Attest-AI-Test-Plan.pdf`,
`docs/Attest-AI-Governance-Walkthrough.pdf`. All in `docs/`, which 404s publicly.

## Broken or untrue, in priority order

1. **No custom SMTP.** Blocks manager credentials, staff invitations and every password
   reset. The single item that appears in all three user journeys. Needs the domain move
   first, because SPF, DKIM and DMARC need a domain you control.
2. **`attest-ai.com` serves a GoDaddy parking page** while every canonical, the sitemap,
   robots.txt and llms.txt point at it. The codebase already migrated; only DNS has not.
3. **`invite-seat` edge function source is not in the repo.** (`governance_state` and the
   rest of the governance schema are captured in migration 0009.)
4. **9 quizzes are still client-scored** with their answer key in the page: the six role
   tracks and three sector overlays use string module ids (`copilot`, `fs` ...) that
   `quiz_keys.module` cannot hold. Modules 1 to 12 are done.
5. **`docs/test-plan.html` QUIZ-01 to QUIZ-05 describe the old client scoring.** True of
   `record_quiz_result`, false of what the pages did before 11 Aug. Rewrite.

Fixed 11 Aug evening: the `pricing.html` robots contradiction (draft-era noindex header
removed); `dbGet`/`dbSet` diverting silently into `localStorage` (visible alert banner now,
no pretend-persistence); the dead inline risk figures on all 21 module/role/sector pages and
the standards-map matrix (external `assets/risk-figure.js` + JSON data blocks,
`assets/standards-map.js`); module-11's print button (inline onclick, never worked live);
skip link (NAV-08), footer heading skips (A11Y-04); webhook NaN replay window;
checkout-thanks duplicate robots meta and wrong hreflang.

## Next steps, ordered, first one startable cold

1. **Netlify form notifications** (dashboard, free, minutes). Nothing tells anyone a form was
   submitted. I audited the submissions on 11 Aug: all seven across five forms are tests, so
   nothing has been missed yet, but the new `demo.html` depends on this.
2. **Point `attest-ai.com` at Netlify.** Add the domain in Netlify FIRST, let the certificate
   provision, then add the records at GoDaddy, then set it primary. Then Resend SMTP.
3. **`docs/SPEC-organisations-auditor-reseller.md`**, in the order the spec gives. Do its two
   prerequisites first: fix `dbGet`, capture `governance_state` in a migration.

## End-to-end journeys, and the hole they found (11 Aug)

`tests/suites/e2e-journeys.mjs` drives the two journeys the product is sold on, through
the real UI against the real project: staff sign in (password + TOTP) and complete every
certificated module, then the manager reads 11/11 on the roster; and a manager publishes
both document packs and works all four registers on the governance dashboard. Spec in
`specs/e2e-scenarios.md`.

Running it found the two defects that mattered most today. **The site-wide CSP sent
`connect-src 'self'`**, so no module page could reach `record_quiz_result`: the course was
uncompletable on the live site, and `cert.html` could not read a record either, because both
sit at the root rather than under `/portal/`. And **the eleven modules meant three different
things** — `modules.js` sells 1 to 10 and 12, the roster counted every row against a literal
11, and module 1 was never server-graded, so 11/11 was unreachable. Both fixed: the Supabase
origin is in the site-wide `connect-src`, module 1 is server-graded when there is a session,
and the roster and certificate register both read their eleven from `modules.js`.

Specifying it found **`set_module_progress`**, a SECURITY DEFINER function in no migration,
executable by `anon`, that wrote `module_progress` from a client-supplied score. It made a
completed course a single REST call, which is the record `cert.html` prints. Migration 0009
drops it, captures the four undocumented governance tables and `ensure_governance_docs`,
and is **applied to the live project**. The caller in `portal/assets/end-user.js` is gone.

Two dedicated accounts do this work: `e2e-manager@attest-ai.com` and
`e2e-staff@attest-ai.com`, the staff seated to the manager, both TOTP enrolled. Credentials
and secrets live in `.env.e2e`, gitignored, never in the repo. Without that file the suite
skips. `scripts/e2e-enrol-totp.mjs` enrols a factor for an account using only its own
password, and prints the lines to paste.

## Certificates read the database (11 Aug)

`cert.html` no longer mints anything from the query string or `localStorage`. `assets/cert.js`
reads `module_progress` and `profiles.full_name` with the learner's own token, so the score,
the date and the reference are the row `record_quiz_result` wrote and the manager roster reads
the same row. Saving the name PATCHes `profiles.full_name`, the only column `authenticated`
may update. Module 1 issues no certificate, it is the free ungated sample and still
client-scored, and `quiz.js` no longer offers it a certificate link. `?m=` alone now carries
the module; `&s=`/`&n=` are ignored. New check NEG-CERT-01c: a `localStorage` record written
from the console mints nothing.

## GOTCHAS (discovered the hard way)

- **Netlify rewrites the served HTML.** Post-processing re-serialises attributes with single quotes and
  strips `.html` into pretty URLs. Any assertion against *served* markup must match the shape, not a
  literal string. This broke two tests that were correct about the repo.
- **Netlify publishes the whole repo.** Anything not blocked in `netlify.toml` ships. `from = "/*.md"`
  does NOT work; splats cannot carry an extension suffix. Blocked: `docs/ specs/ supabase/ tests/
  scripts/ netlify/ video-m1/ video-m2/ .audit/` + named files incl. `sales-deck.html`.
- **Production CSP is `script-src 'self'` with no unsafe-inline, nonce or hash.** Every inline
  `<script>` is dead on the live site and silently so. It broke the certificate page for months and the
  theme flash-preventer on 77 pages. Local testing sends no CSP, so it never shows up until deployed.
- **`video-m2` scripts need `.mts` + `npx tsx --env-file=.env`.** package.json has no `"type": "module"`,
  so a `.ts` compiles to CJS and top-level await fails. Node here is 20.11, so the `--strip-types` in the
  old header never worked. The ElevenLabs key is already in `video-m2/.env`.
- **`gen-module-audio.mts` skips any scene whose mp3 already exists.** To regenerate one line you must
  delete that scene's `.mp3` and `.json` first, or you render new captions over old audio.
- **The shell is zsh.** `read -p` is bash; zsh wants `read -rs "VAR?prompt: "`.
- **`git add -A` will sweep up a background agent's half-written files.** It happened: an agent's
  in-progress Playwright files landed in an unrelated commit.
- **`portal/assets/theme.js` and `assets/theme-boot.js` are inverted on purpose.** The portal is dark by
  default and stores an opt-in to light; the marketing site is light by default and stores an opt-in to
  dark. Do not merge them.
- **`module-1.html` has no `course-gate.js`** and must not get one. It is the free sample and the intro
  video says so. A dead inline gate that would have paywalled it was removed on 31 Jul.
- Portal pages are `Cache-Control: private, no-store`; marketing pages are `max-age=300`, so a change
  can look undeployed for five minutes. Verify with a cache-busting query, not a hard refresh.

## Where things live
`assets/` site JS+CSS · `portal/` the app (`aimp.js` = Governance Centre, 16 sections) ·
`netlify/functions/` Stripe · `supabase/migrations/` schema (0007 = `stripe_events`) ·
`tests/` suites + `tests/pages/` POM · `docs/` internal, 404s publicly ·
`video-m1/` Module 1 · `video-m2/` Modules 3–12 · `video-project/` platform demo.
**No source in repo for `module-2.mp4`.**
