# HANDOFF — Attest AI / ai-safe-at-work

Updated: 4 Sep 2026 · Everything committed, pushed and live; working tree clean. `git log -1` for the head.
Supersedes the 26 Jul version. Full decision history in DOCTRINE.md; this file is the cold resume.

## What this is
Static site + Supabase (`hanjrsslhnuauaysbhun`) selling AI governance to UK/EU SMEs and MSPs.
Live at **https://attest-ai.com** (since 1 Sep 2026; `aisafework.netlify.app` still answers). **git push = deploy** (Netlify site `89ac5015-…`).
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
After `grant_credits` the webhook calls `sendWelcome`, which asks GoTrue (`/auth/v1/recover`) to
email the manager the same reset link as "Forgot your password?", landing on `/portal/login.html`.
It never throws: anything that throws below the additive grant would double-credit on the retry.

**Nav is three sections + Sign in** (3 Aug): Products · Course · Governance · [Sign in]. Who We Help,
Plans, Book a Demo and Become a Partner moved to a footer **Explore** column. New pages: `governance.html`
(public Governance Centre overview) and `demo.html` (dedicated Book a Demo page).

**Course page lists only Module 1**, as a clickable card to the free ungated page.

**Every quiz is server-scored (11 Aug for modules 1–12, 2 Sep for the nine role/sector
tracks).** Modules → `record_quiz_result` → `module_progress`; tracks → `record_track_quiz_result`
→ `track_progress` (migration 0010). No page carries an answer key. Module 1 is the one
deliberate exception: signed out it is the free sample, marks itself, records nothing.
Certificates render from `module_progress`; the manager roster counts the eleven from `modules.js`.

**Test board: 13 suites, 272 passed, 0 failed, 14 deliberate skips (2 Sep 2026), target
`https://attest-ai.com`.** `node tests/run-all.mjs`. Unit (pricing, webhook sig, nomination),
HTTP (exposure, public site, RLS), browser (Playwright, 112), and six journey suites against
production: staff course + governance (`e2e-journeys`), first-time onboarding, password reset
(skips: no mailbox), signup front door, invite, manager first day + teammate (screenshots to
`tests/evidence/<run>/`). Journeys run as dedicated `e2e-*@attest-ai.com` accounts whose secrets
live in `.env.e2e` (gitignored); without it they skip. Playwright resolves from `~/projects/mlr`.

**Docs worth reading before touching anything:** `docs/ACTION-ITEMS.md` (34 items, P0→P4),
`docs/USER-JOURNEYS.md` (three roles + the roles that have no row), `docs/Attest-AI-Test-Plan.pdf`,
`docs/Attest-AI-Governance-Walkthrough.pdf`. All in `docs/`, which 404s publicly.

## Broken or untrue, in priority order

Nothing known. Every quiz on the site is server-scored (migration 0010 closed the last
nine on 2 Sep), the test plan describes what ships, and the board is green. Open items are
decisions and dashboards, in ACTION-ITEMS and the runbook.

Fixed 1–2 Sep: no custom SMTP (Resend now, proven), `attest-ai.com` parking page (live on
Netlify with cert), `invite-seat` source missing from the repo (transcribed, reviewed, v3), the
nine role-track/sector quizzes still client-scored (0010: `track_keys`, `track_progress`,
`record_track_quiz_result`), the test plan describing pre-11-Aug scoring. Audit cuts landed
the same day: 28 dead tests, the unlinked `v2/` site and its feeders, the dead classifier.

Fixed 11 Aug evening: the `pricing.html` robots contradiction (draft-era noindex header
removed); `dbGet`/`dbSet` diverting silently into `localStorage` (visible alert banner now,
no pretend-persistence); the dead inline risk figures on all 21 module/role/sector pages and
the standards-map matrix (external `assets/risk-figure.js` + JSON data blocks,
`assets/standards-map.js`); module-11's print button (inline onclick, never worked live);
skip link (NAV-08), footer heading skips (A11Y-04); webhook NaN replay window;
checkout-thanks duplicate robots meta and wrong hreflang.

## This session, 1–2 Sep 2026 (commits 5ee0312 → cb35672)

Launch runbook Phases 1, 2, 4 and 5 (machine half) executed and proven; production sweep;
audit cuts; last client-scored quizzes moved server-side; test plan brought current.
- **Domain live**: `attest-ai.com` on Netlify with cert (apex + www); DNS at 123-Reg (registrar
  confirmed by RDAP; its `domaincontrol.com` nameservers are GoDaddy-group, which 123-Reg uses).
- **Email delivers**: Resend domain verified (DKIM/SPF/MX); Supabase Auth on Resend SMTP as
  `no-reply@attest-ai.com`, 30/h, redirects for attest-ai.com/www/netlify.app — applied by
  `scripts/phase2-supabase-auth-config.mjs`; a real reset email arrived in a human inbox.
- **Form notifications** on `order`/`demo`/`partner-enquiry` → reidalastair@rocketmail.com (James@
  cannot receive: no MX). Orphan forms + test rows deleted. All by Netlify API.
- **invite-seat** transcribed into `supabase/functions/`, reviewed, redeployed (v3, link →
  attest-ai.com). Invite → enrol → module → roster proven; `e2e-invite` guards it.
- **Landing**: fade-in, big Sign up, self-serve signup flow (creates end_user; confirmation
  email). Auth buttons ship disabled until wired (a pre-wire click native-submitted the form).
- **Idle logout**: 10 min, every authed page (`assets/idle-logout.js`).
- **Audit cuts** (−11,415 lines): 28 dead tests, unlinked `v2/` + 3 Python feeders, dead
  classifier engine, `.netlify/state.json`; dedupes (escaper, env parser, Stripe bands → 
  `netlify/functions/bands.mjs`, Supabase constants → `tests/lib/supabase.mjs`).
- **Migration 0010**: `track_keys`, `track_progress`, `record_track_quiz_result`; nine pages lose
  their keys. Test plan QUIZ-01–06/FRM-03/07 rewritten. HANDOFF "broken" list emptied.
- **Fixtures**: `e2e-manager`, `e2e-staff`, `e2e-newstarter`, `e2e-newmanager`, `e2e-freeagent`,
  `e2e-teammate` (see `.env.e2e`). JC: temp password issued by phone 18 Aug, 500 credits, no
  authenticator yet — his first browser sign-in enrols it.

## Next steps, ordered, first one startable cold

1. **Stripe** (🧑, runbook Phases 0 and 3): create account, start Bacs verification (days), then
   4 Netlify env vars, webhook `/.netlify/functions/stripe-webhook` on the two `checkout.session.*`
   events, VAT decision, one real £990 charge-and-refund.
2. **JC's first sign-in and first invite** (🧑, Phase 5 human half). Then revoke the `phase2`
   Supabase token if not already expired (24 h).
3. **Decide the signup exposure** (🧑): a self-serve account passes the client-side course gate
   (`course-gate.js`), so the paid course is free to anyone who signs up. Server-side seat check
   or public signups off, before charging.
4. **`docs/SPEC-organisations-auditor-reseller.md`** (🤖): its prerequisites (`dbGet`,
   `governance_state` migration) are done.
5. Optional cut from the audit: relocate `.audit/` (69 files, 17 MB) out of the site repo.

Done 4 Sep: the webhook welcome email (`sendWelcome`, see Payments above; six unit checks in
`tests/stripe-webhook.sig.mjs`). Unprovable end to end until Stripe is live, but the recover
endpoint answered 200 to the same call with the same redirect from this Mac.

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

Dedicated accounts do this work: `e2e-manager@` and `e2e-staff@` (staff seated to the
manager, both TOTP enrolled), `e2e-newstarter@` (onboarding, self-resets its factor),
`e2e-newmanager@` (manager first day, self-resets) and `e2e-freeagent@` (end_user with
the course complete, seated to nobody — seating them proves the training statistic). Credentials
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

- **Leave a portal page at a person's pace in tests.** `goto` within milliseconds of landing aborts
  the page's own `getUser`/reload fetch; supabase-js logs "Failed to fetch" and the AIMP shell
  throws "unauthorised". Page objects drain `networkidle` before navigating (doctrine rule 8).
- **GoTrue lists factors on `GET /auth/v1/user`**, not `GET /auth/v1/factors` (answers empty,
  stranded a factor once). Un-enrolling needs aal2, i.e. the factor's own secret.
- **Supabase Management API types `smtp_port` as a string** ("465"); a number is a 400.
- **Netlify serves pretty URLs**: `/portal/login.html` becomes `/portal/login` in `location`;
  match `/login(\.html)?$` in tests.
- **A static button whose listener arrives with a module script has a dead-click window.**
  Ship it `disabled`, enable at wire time (`wireSignOut`, auth submit buttons).
- **Persist any captured TOTP secret the instant you have it**; two crashed runs stranded
  factors that then needed SQL to remove.
- **Netlify personal token** lives in `~/Library/Preferences/netlify/config.json` and works for
  the REST API (domains, hooks, forms, submissions) — no `netlify` CLI installed.
- **Computer-use can only READ browsers**; clicking needs the Claude-in-Chrome extension, which
  cannot sign in with an Apple-SSO Claude account. Clipboard-read is the practical bridge.
- **`timeout` is not on this Mac**; use `( cmd & pid=$!; sleep N; kill $pid )` or background tasks.
- **Orphan-test sweeps: exclude what `run-all` lists.** `ls tests/*.mjs | grep -v run-all` also
  removed the three live unit suites (restored from git before commit).

## Where things live
`assets/` site JS+CSS · `portal/` the app (`aimp.js` = Governance Centre, 16 sections) ·
`netlify/functions/` Stripe · `supabase/migrations/` schema (0007 = `stripe_events`) ·
`tests/` suites + `tests/pages/` POM · `docs/` internal, 404s publicly ·
`video-m1/` Module 1 · `video-m2/` Modules 3–12 · `video-project/` platform demo.
**No source in repo for `module-2.mp4`.**
