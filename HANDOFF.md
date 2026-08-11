# HANDOFF — Attest AI / ai-safe-at-work

Updated: 11 Aug 2026 · Last commit `b5e4b9c` · **Uncommitted work in tree, see bottom of this section.**
Supersedes the 26 Jul version. Full decision history in DOCTRINE.md; this file is the cold resume.

## What this is
Static site + Supabase (`hanjrsslhnuauaysbhun`) selling AI governance to UK/EU SMEs and MSPs.
Live at **aisafework.netlify.app**. **git push = deploy** (Netlify site `89ac5015-…`).
Pre-push hook validates JSON-LD and blocks secrets + forbidden files.

Module 12's video was re-rendered on 11 Aug and deployed: it narrated the pre-Omnibus
Article 4 wording. Duration went 80.2s to 88.5s because the corrected line is longer and the
composition sizes itself from the audio.

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

**Test suites, ~120 checks.** `node tests/run-all.mjs`. Suites: pricing logic, webhook signature,
manager nomination, exposure/headers, public site, authorisation (RLS), browser (Playwright).
Browser suite resolves Playwright from `~/projects/mlr` via `createRequire`.
Currently 2 known failures, both the `pricing.html` robots contradiction.

**Docs worth reading before touching anything:** `docs/ACTION-ITEMS.md` (34 items, P0→P4),
`docs/USER-JOURNEYS.md` (three roles + the roles that have no row), `docs/Attest-AI-Test-Plan.pdf`,
`docs/Attest-AI-Governance-Walkthrough.pdf`. All in `docs/`, which 404s publicly.

## Broken or untrue, in priority order

1. **The assessment does not do what the product sells.** `quiz_keys` has **0 rows**, `quiz.js` never
   calls `record_quiz_result`, and it writes scores to `localStorage` only. `audit_log` has 0
   `module_completed` entries. So "Training completion records you can hand to an auditor" has **no
   server-side source**, and the answer key ships to the browser (`"correct": N` in each page's
   `quiz-data` JSON). One build, not three fixes. See ACTION-ITEMS P0b.
2. **No custom SMTP.** Blocks manager credentials, staff invitations and every password reset. It is
   the single item that appears in all three user journeys. Needs the domain move first (SPF/DKIM/DMARC).
3. **`attest-ai.com` serves a 123-Reg parking page** while every canonical, the sitemap, robots.txt and
   llms.txt all point at it. The codebase already migrated; only DNS has not.
4. **`pricing.html` robots contradiction.** Meta says index, sitemap lists it, header sends noindex and
   wins. Two failing tests.
5. **`dbGet` swallows permission errors into `localStorage`**, and **`governance_state` is in no
   migration**, and **`invite-seat` source is not in the repo**. Fix 1 and 2 before reshaping schema.

## Next steps, ordered, first one startable cold

1. **Netlify form notifications** (dashboard, free, minutes). Nothing tells anyone a form was
   submitted, including the new `demo.html`. Highest value per minute in the whole list.
3. **Point `attest-ai.com` at Netlify.** Add domain in Netlify FIRST, let the cert provision, then add
   records at 123-Reg, then set primary. Then SMTP via Resend.
4. **The quiz rebuild** (ACTION-ITEMS P0b): populate `quiz_keys`, point `quiz.js` at
   `record_quiz_result`, strip `correct` from the client JSON, then correct the test plan's QUIZ section.
5. **One spec covering organisation entity + auditor role + reseller provisioning.** Alastair approved
   all three; they are the same migration and must not be built separately. Do not start before 5 above.

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
