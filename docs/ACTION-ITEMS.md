# Attest AI, open action items

Opened 31 Jul 2026. Everything below came out of the test-plan build, the automated
suites, or the self-review of that session's diff. Tick items off in place.

`🧑` = only Alastair can do it (money, domain, DNS, dashboards, accounts).
`🤖` = Claude can do it on request.

Lives in `docs/`, which `netlify.toml` 404s, because it names security defects.

---

## P0, must fix before Stripe takes real money

- [x] 🤖 **`stripe-webhook.mjs:79` `releaseEvent` cannot report its own failure.** `fetch`
      resolves on 4xx/5xx, so the `try/catch` only sees network errors. A failed DELETE
      leaves the event claimed, Stripe's retry sees a duplicate and skips, and the
      customer has paid for nothing with no error logged anywhere. Check `r.ok`.
- [x] 🤖 **`stripe-webhook.mjs:87` `findOrCreateUser` falls through on a failed lookup.**
      A transient Supabase 500 creates a duplicate account instead of failing. Throw on
      `!found.ok`.
- [x] 🤖 **`checkout-stripe.js:34` defaults a missing plan to Foundation.** If
      `checkout.js` fails to load, a Platform visitor takes the Foundation price path.
      Default to `""` and let the guard refuse. Fail closed, not to the cheaper plan.
- [ ] 🧑 **Decide VAT.** `VAT_RATE` is unset, so the advertised ex-VAT price is charged
      as-is. If VAT registered and this ships unset, you absorb the VAT on every sale.
      **Deferred 14 Aug** until the Stripe account exists; recorded as blocking the
      first real charge in docs/LAUNCH-RUNBOOK.md Phase 3.

## P0d, the course could not be completed, and completion was forgeable

Found 11 Aug 2026 by the end-to-end journeys. All three fixed and deployed the same day.

- [x] 🤖 **`connect-src 'self'` blocked every quiz from being scored in production.** The
      module pages and `cert.html` are at the site root, so the site-wide CSP applied, not
      the `/portal/*` one that already allows Supabase. Every learner on the live site saw
      "Could not mark this attempt", and the certificate page could not read a record
      either. Local testing sends no CSP, so it looked fine everywhere except production —
      the third time this trap has cost a paid surface. Fixed in `_headers`.
- [x] 🤖 **The eleven modules meant three different things.** `modules.js` sells 1 to 10
      and 12; the manager's roster counted every `module_progress` row against a literal
      11, so it counted the finale and could never count module 1, which `quiz.js` refused
      to score server-side. 11/11 was unreachable. Module 1 is now server-graded when there
      is a session, the roster and the certificate register both read their eleven from
      `modules.js`, and passing a quiz marks the module complete so the module 11 finale
      unlocks without hunting for the button.
- [x] 🤖 **`set_module_progress(p_module, p_score)` defeats migration 0006.** SECURITY
      DEFINER, `execute` granted to **`anon` and `authenticated`**, and it writes
      `module_progress` straight from a client-supplied score with no answer checking.
      One REST call forges a completed course, which is the row `cert.html` now prints
      and the manager's roster reads. It is in no migration, so nothing in the repo
      showed it. Fix written as `supabase/migrations/0009_*.sql` (drops it, and captures
      the four undocumented governance tables at the same time); the caller in
      `portal/assets/end-user.js` is already removed. Applied to the live project on
      11 Aug; `set_module_progress` no longer exists.
- [x] 🤖 **`governance_state` is in no migration** — captured in 0009, along with
      `governance_docs`, `governance_items`, `governance_acks` and
      `ensure_governance_docs()`.

## P0b, the assessment does not do what the product sells

Found 3 Aug 2026 while proving the modules have videos and quizzes. All three are one
build, not three fixes, and they should ship together.

- [x] 🤖 **`quiz_keys` is empty, 0 rows.** `record_quiz_result` raises
      `no answer key for module %` for every module, so the server-side scorer cannot
      score anything. Populate it from the `correct` values currently sitting in the
      page JSON.
- [x] 🤖 **`quiz.js` never calls the scorer.** It writes to `localStorage` and nothing
      else. `audit_log` holds 0 `module_completed` entries. Point it at
      `record_quiz_result` so a pass reaches the database.
- [x] 🤖 **The answer key ships to the browser.** Every question on all 18 module pages
      carries `"correct": N` in the `quiz-data` JSON. View Source gives a learner every
      answer. Strip it once scoring is server-side; `why` and `cite` can stay, they are
      the post-answer explanation.
- [x] 🤖 **Consequence to fix with the above:** "Training completion records you can hand
      to an auditor" is on the Foundation bullet list and the checkout page, and has no
      server-side source. Certificates are generated from client-side state, which the
      learner can edit. This is the claim most exposed to a customer's auditor.
      **Done 11 Aug:** `cert.html` reads `module_progress`. Score, date and reference come
      from the row `record_quiz_result` wrote; the query string and `localStorage` mint
      nothing. The name comes from `profiles.full_name`, the same one the manager roster
      shows, and saving it PATCHes that column rather than the browser. Module 1 issues no
      certificate: it is the free ungated sample, still client-scored, so there is no
      record behind it. New test NEG-CERT-01c covers the `localStorage` forgery.
- [x] 🤖 **Correct the test plan.** QUIZ-01 to QUIZ-06 rewritten 2 Sep to describe what
      ships: every quiz server-scored (modules via `record_quiz_result`, tracks via
      `record_track_quiz_result`), keys out of every page, certificate from the record.
      FRM-03/07 brought current at the same time.

## P0c, paid content teaches superseded law

The Digital Omnibus on AI entered into force 27 Jul 2026 and moved the high-risk
deadlines. Article 50 transparency and the full penalty regime started 2 Aug 2026.
Article 4 was retained but softened. Found 11 Aug 2026, so the content below has been
wrong for about two weeks on a product that sells being current.

- [x] 🤖 **`sector-financial-services.html`**: "Article 26 deployer obligations from
      August 2026". Article 26 is the high-risk regime, deferred to 2 Dec 2027
      (Annex III) and 2 Aug 2028 (Annex I).
- [x] 🤖 **`sector-healthcare.html`**: same claim, same problem.
- [x] 🤖 **`sector-public-sector.html`**: "Article 86 right to explanation (in force
      August 2026)", stated three times, **including as the correct answer to a graded
      quiz question**. A learner is being marked right for a date that moved.
- [x] 🤖 **`sales-deck.html`, public, returns 200**: "staff must have 'sufficient AI
      literacy'". That is the pre-Omnibus wording. Article 4 now reads support the
      development of AI literacy, and explicitly does not require guaranteeing any
      level of literacy in any individual.
- [x] 🤖 **`module-1.html`**: teaches Article 4 as "staff who use AI need enough know-how
      to use it safely", and grades a quiz question on it. Same softening applies.
- [x] 🤖 **`rollout-guide.html`, public**: Article 4 described as a literacy obligation
      evidenced by a training register. Still broadly right, but check the wording
      against the amended text.
- [ ] 🧑 **Decide the standing process.** The product promises "annual refresher training
      to stay current as the rules move". The rules moved and nothing flagged it. A
      quarterly legal-currency review belongs in the audit pack cadence.

## Built 11 Aug, awaiting only your dashboard actions

- [ ] 🧑 **Netlify env vars are completely empty.** Verified via the API: zero variables set.
      Nothing needs them today (the quiz scores through the publishable key), but Stripe and
      the webhook both do.
- [x] 🧑 **Netlify form notifications.** Done 2 Sep via API. Checked the submissions while I was in there: all
      seven across the five forms are tests, including one titled "TEST SUBMISSION - please
      delete" and one from your own Safari on 31 Jul. **No real enquiry has been missed.**
      I cannot delete submissions or configure notifications; both are dashboard only.
- [x] 🧑 **Orphaned forms `tier1-order` and `foundation-order` both have 0 submissions.** Deleted 2 Sep via `DELETE /sites/{id}/forms/{form}`. The
      API can only enable or disable forms site-wide, so deleting them individually is
      dashboard only.

## P1, revenue is leaking today

- [x] 🧑 **Turn on Netlify form notifications.** Done 2 Sep: `submission_created` email hooks on `order`, `demo`, `partner-enquiry` → reidalastair@rocketmail.com (James@attest-ai.com cannot receive — the domain has no MX; switch the recipient once a mailbox exists). Proven with a live demo submission. Free, dashboard only, minutes. Nothing on
      the site tells anyone a form was submitted. Route `order`, `demo` and
      `partner-enquiry` to James@attest-ai.com. The new `demo.html` depends on this.
- [x] 🧑 **Delete the orphaned forms** `tier1-order` and `foundation-order`. Done 2 Sep. They still
      accept submissions nobody watches.
- [x] 🧑 **Delete the test form submissions** made 25 Jul. All five deleted 2 Sep; inbox starts clean.
- [x] 🧑 **Point `attest-ai.com` at Netlify.** Done 1 Sep: cert issued, live. Add the domain in Netlify FIRST, let the
      certificate provision, then add the records at GoDaddy, then set it primary.
      Until this happens every canonical, the sitemap, `robots.txt` and `llms.txt` all
      tell Google the real site lives on a parking page.
- [x] 🤖 **Fix the `pricing.html` robots contradiction.** Meta says `index`, sitemap
      lists it, the header sends `noindex` and wins. The priced page cannot be found.
      Two tests fail on this (SEO-01, SEO-03). Needs a decision on which of the three
      changes.

## P2, blocks customers actually getting in

- [x] 🧑 **Custom SMTP via Resend (AUTH-1).** Done 2 Sep; reset email proven delivered. No invite, magic link or password reset is
      delivered without it. Needs the domain above for SPF, DKIM and DMARC.
- [x] 🧑 **Raise the Supabase auth email rate limit** — 30/h, applied 2 Sep.
- [x] 🧑 **Add the portal sign-in URL to the Supabase redirect allowlist.** attest-ai.com, www and netlify.app, 2 Sep.
- [ ] 🧑 **JC McKenny: first sign-in.** Everything he will touch is proven (2 Sep): invite sends, arrives, enrols, module passes, roster shows. Only his own authenticator enrolment remains, and it must be his. Auth is armed, his password works. He must do the
      first sign-in himself, because it forces TOTP enrolment and whoever completes it
      holds the authenticator secret.
- [x] 🧑 **Decide JC's seat credits.** Set to 500 on 18 Aug. Temporary password issued the same day (handed over by phone; SMTP not yet live); no TOTP enrolled yet, so first browser sign-in shows the QR.
- [ ] 🧑 **Stripe: create the account, verify the business, enable Bacs.** Days of
      waiting, so start early.
- [ ] 🧑 **Add the Netlify env vars**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
      `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
- [ ] 🧑 **Register the Stripe webhook** at `/.netlify/functions/stripe-webhook`,
      subscribed to `checkout.session.async_payment_succeeded` and
      `checkout.session.completed`.

## P3, defects found by the test suite

- [x] 🤖 **The interactive risk figure is dead on all 18 module pages.** Inline script,
      blocked by `script-src 'self'`. Same root cause as the certificate bug. A teaching
      element in a paid course that has never worked.
- [x] 🤖 **The standards-map coverage matrix is dead**, same cause.
- [x] 🤖 **Skip link renders at `top: -85px` when focused** (NAV-08). It takes keyboard
      focus but is invisible, on a site selling accessibility compliance.
- [x] 🤖 **Heading levels skip `h2 → h4`** in the footer on most pages (A11Y-04).
- [x] 🤖 **Widen the CSP test to every page.** It samples 12, so 17 of the 18 broken
      module pages fail outside coverage. This is exactly how the certificate bug
      survived to production.
- [x] 🧑 **Six role-track modules have no video**: Copilot, DPO, Manager, MSP Admin,
      Procurement, Shadow AI. **Decided 14 Aug: videos later, copy stays.** Accepted
      risk that a buyer notices during a demo; listed in the runbook's standing risks.

## P4, code review leftovers, not urgent

- [x] 🤖 `stripe-webhook.mjs:41` non-numeric `t` makes the replay window `NaN`, which
      silently skips the check. HMAC still saves it. Add `Number.isFinite`.
- [x] 🤖 `stripe-webhook.mjs:16` comment still says `AUTH_DISABLED is still true`. It was
      flipped to false the same day.
- [x] 🤖 (done 2 Sep, `netlify/functions/bands.mjs`) Band keys duplicated between `stripe-webhook.mjs:24` and
      `create-checkout-session.mjs:18-19`. Add a band to one and checkout takes money
      that fulfilment throws on. Extract to one module.
- [x] 🤖 `stripe-webhook.mjs` `grant_credits` is additive but the error path
      releases the event, so a retry re-runs it. Rule now sits in the code as a comment
      above the first line below the grant (`sendWelcome`, 4 Sep), which swallows its own
      failures for exactly this reason. Still true: anything that throws below it double-grants.
- [x] 🤖 (moot 8 Sep: the name is set inside `fulfil_stripe_event`) `stripe-webhook.mjs:120` `full_name` PATCH result unchecked.
- [ ] 🤖 `checkout.html` button says "Buy Foundation", copy above promises an invoice.
      Pick one story. The Over-50 band also says "Buy" but receives a quote.
- [x] 🤖 `checkout-thanks.html` has two `<meta name="robots">` tags with different values.
- [x] 🤖 CTA casing drift, "Book a Demo" vs "Book a demo".

## Codex audit, 9 Sep 2026 (gpt-6-astra, OWASP Top 10 + functional + non-functional; all fixed the same day)

- [x] 🤖 **P1** `assets/cert.js` certificate query had no `user_id` filter: a manager holding seats
      read staff rows through the roster policy and could print a staff member's pass as their own
      certificate. Filtered.
- [x] 🤖 **P1** `privacy.html` said "no account system, no login, no data". Replaced with a notice
      covering accounts, training and governance records, Stripe, Resend, London hosting, retention
      and rights. 🧑 Confirm `hello@attest-ai.com` receives mail and the 90-day / six-year retention
      statements are the policy you want.
- [x] 🤖 **P2** `invite-seat` deleted the account on any seat error; a committed seat with a lost
      response cascaded the seat away and kept the charge. Reconciles first (v4).
- [x] 🤖 **P2** `portal.js` sign-out kept the local session on a server failure and login.html
      routed straight back in. Clears the stored session itself.
- [x] 🤖 **P2** `profiles.email` set once at creation; an Auth email change left invites and
      fulfilment matching a stale address. Trigger on `auth.users` email update (0014).
- [x] 🤖 **P2** `aimp.js` failed saves resolved as success ("Saved" over a failure banner). Throw.
- [x] 🤖 **P2** `aimp.js` whole-register last-write-wins across tabs. Save lands only if the row
      still carries the `updated_at` it loaded with.
- [x] 🤖 **P2** `governance.js` discarded query errors and rendered zeros. "Dashboard unavailable".
- [x] 🤖 **P2** `governance.js` no pagination past PostgREST's 1,000 rows. Every list paged.
- [x] 🤖 **P2** Governance Centre registers (`governance_state`) and dashboard totals
      (`governance_items`) never met. Dashboard now counts both. Full consolidation into one
      table is still the right end state; not done.
- [x] 🤖 **P2** No audit triggers on governance tables (A09). Documents, items and acks audited (0014).
- [x] 🤖 **P2** 28 templates' print buttons were inline `onclick`, dead under CSP. `print-button.js`.
- [x] 🤖 **P2** `completion.js` finale unlock was a browser-local flag. Synced from `module_progress`.
- [x] 🤖 **P2** Nine GDPR documents seeded with no content link could be published and
      acknowledged. Publish is blocked until a link exists; the documents themselves are still
      to be written (🧑 decide whether to source them or drop them from the pack).
- [x] 🤖 **P3** Governance Centre modal had no dialog semantics. role=dialog, focus trap, Escape,
      focus restoration.
- [ ] 🤖 **P3** Consolidate the Governance Centre registers into `governance_items` (one table,
      one workflow). Half a day; the dashboard merge above is the stopgap.
- [ ] 🧑 The nine GDPR documents without content: write or source them, or remove them from the
      seeded pack.

## Codex audit, 8 Sep 2026 (gpt-6-astra, whole repo; verdicts are Claude's, checked against the code)

- [x] 🤖 **P1** (done 8 Sep, 0013 written, 🧑 apply pending) `netlify/functions/stripe-webhook.mjs`
      the `full_name` PATCH below the additive grant can reject on a network error, which
      releases the event and Stripe's retry grants again. Fixed with the next item:
      `fulfil_stripe_event` (claim + grant + name in one transaction), migration 0013.
- [x] 🤖 **P1** (done 8 Sep, same change) `stripe-webhook.mjs` a hard crash between claim and
      grant leaves the event marked processed and the customer unprovisioned. No claim exists
      outside the transaction now.
- [ ] 🤖 **P3** Follow-up from the Codex re-review of that change: the 16 webhook unit checks
      prove the function's handling of the `fulfil_stripe_event` contract, not the SQL. A
      database-level check (two concurrent deliveries, a raise after the credit update, a retry
      after a lost response; assert balance and ledger rows) needs the service key and an applied
      0013, so it runs on a Supabase branch or after Phase 3, not on this Mac.
- [x] 🤖 **P1** (done 9 Sep, 0014, RLS-16) No policy or definer function requires `aal2`. TOTP is enforced by the browser only;
      a password-only token reaches PostgREST and every RPC. Fix: `(auth.jwt()->>'aal') = 'aal2'`
      in the policies and functions that guard records, with an allowance for enrolment. Needs a
      migration and RLS checks.
- [x] 🤖 **P2** (done 9 Sep, 0014) `assign_seat` is check-then-write: two managers can seat the same unowned user,
      and one credit can be spent twice. No unique on `seats.end_user_id`, no `check >= 0` on
      credits. Fix: `update … where credits_balance > 0` + raise on zero rows, `for update` on the
      target profile, unique index on `end_user_id`.
- [x] 🤖 **P2** (done 9 Sep: publish mirrors onto governance_docs) `portal/assets/aimp.js` the Governance Centre AUP editor publishes to
      `governance_state` and toasts "staff can now acknowledge it", but staff read
      `governance_docs`. The dashboard publish path does reach staff (MGR-04). Two paths, one
      misleading. Fix: have the AIMP publish set the `governance_docs` AUP row live, or fix the toast.
- [x] 🤖 **P2** (done 9 Sep: load-failed lock) `aimp.js` `dbGet` failure returns the empty fallback with a banner but `dbSet`
      still upserts, so a save after an outage overwrites a real register. Fix: load-failed flag
      that `dbSet` refuses.
- [x] 🤖 **P2** (done 9 Sep, 0014; republish still keeps acks, by decision) `governance_acks` has no unique `(doc_id, end_user_id)`; a double tap inflates the
      acknowledgement percentage. Acks also survive republishing (product decision).
- [x] 🤖 **P2** (done 9 Sep, assets/sb-session.js) `assets/quiz.js` course pages use the stored access token and never refresh it; a
      learner over an hour on the pages gets "could not mark" and retry does not help. Fix:
      refresh via the stored refresh token when the JWT is near expiry.
- [x] 🤖 **P2** (done 9 Sep) `portal/assets/login.js:11` the `next` check lets `/\evil.com` through (browsers
      read it as `//evil.com`). Fix: `new URL(next, location.origin).origin === location.origin`.
- [x] 🤖 **P2** (done 8 Sep, 0013) `grant_credits` is in no migration (0007 only references it).
      Captured with the service-role-only grant it has live.
- [x] 🤖 **P3** (done 9 Sep) `portal/assets/governance.js:55` the training stat counts any eleven done rows,
      not the eleven sold modules (`manager.js` was fixed in August, this was not).
- [x] 🤖 **P3** (done 9 Sep, 0014) `governance_acks` insert policy does not require the doc to be live and owned by
      the stated manager. Harmless today (the dashboard filters by its own live docs); the policy
      should say so.

## Known structural gaps, decisions not yet made

- [ ] 🧑 **Self-serve signup hands out the paid course (decided-by-request 30 Aug).** The
      landing page now leads with Sign up; any self-serve account passes `course-gate.js`,
      which is a client-side token-presence check. This was already true of the raw API
      (signups were enabled), the button makes it a visible path. Options when revenue
      matters: gate modules 2+ behind a seat/subscription check server-side (the
      "move content behind an edge function" ponytail note in course-gate.js), or disable
      public signups again. Decide before charging for the course.

- [x] 🤖 **`dbGet` swallows permission errors into `localStorage`.** An RLS mistake would
      quietly move a customer's governance data into their own browser and look like an
      empty register. Fix before anything depends on who can read what.
- [ ] 🤖 **`governance_state` is in no migration.** The entire manager portal lives in a
      table the repo cannot reproduce.
- [x] 🤖 **`invite-seat` edge function source is not in the repo.** Transcribed 2 Sep to `supabase/functions/invite-seat/index.ts`, reviewed twice, redeployed as v3 (invite link on attest-ai.com, CORS pinned to portal origins, no orphan on seat failure, manager/reseller emails refused).
- [ ] 🧑 **Which acknowledgement store is authoritative**, `governance_state` or
      `governance_acks`? They are unlinked, so a staff sign-off may never show on the
      manager roster.
- [ ] 🧑 **Staff cannot open the sign-off page at all**, `guard(["manager"])` bounces
      them. Inherited from the claude.ai artifact this screen was ported from.
- [ ] 🧑 **Platform plan has no online payment path.** Falls back to the invoice form by
      design. Decide whether to wire it (subscription mode, its own tests).

---

## Current test state

`node tests/run-all.mjs` — 110 checks. Browser suite needs Playwright resolved from
`~/projects/mlr`.

| Suite | State |
|---|---|
| pricing logic | 12 pass |
| webhook signature | 9 pass |
| exposure and headers | 26 pass |
| public site | 40 pass, 2 fail (pricing.html robots), 6 skip (destructive) |
| authorisation | 15 pass |
| browser | 65 pass, 4 fail |
