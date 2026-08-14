# Spec — end-to-end scenario tests

Written 11 Aug 2026. Two journeys, driven through the real UI against the real Supabase
project, no mocking of the application's own back end.

## Scenarios

**S1, staff member completes the course and the record shows up.**
Sign in (password + TOTP) → reach the course → pass the knowledge check on every
certificated module → own progress shows complete on `portal/end-user.html` → the
manager sees that staff member at 11/11 on `portal/manager.html`.

**S2, manager completes every area of the governance dashboard.**
Sign in (password + TOTP) → `portal/governance.html` → move every document in both packs
(AI and GDPR) to Live → log an item in all four registers (risk, incident, use case,
vendor) → cycle a status and edit a title → the five dashboard statistics reflect it.

## Preconditions and test data

Two dedicated accounts, created for this suite and used by nothing else:

| Role | Purpose |
|---|---|
| `manager` | S2, and the reader half of S1 |
| `end_user`, seated to that manager | S1 |

- Credentials and TOTP secrets live in `.env.e2e`, which `.gitignore` already covers
  (`.env.*`). Nothing secret enters the repo. Without that file the suite **skips**, it
  does not fail, so `node tests/run-all.mjs` still runs for anyone else.
- Both accounts enrol TOTP once at creation, because `portal.js` requires `aal2` for every
  role. The suite generates codes from the stored secret with a 30-line RFC 6238 helper
  (`node:crypto`, no dependency).
- The answer key comes from `supabase/migrations/0008_quiz_keys_seed.sql`, the same rows
  that seeded `quiz_keys`. The browser cannot read the key, so the test reads the fixture
  rather than the database.

## Idempotence instead of teardown

`module_progress` cannot be deleted by any client (0006 revoked those grants), so a
"clean database before each run" is not available without the service key. The suite is
written so that a second run leaves the same end state as the first:

- Passing a quiz again is an upsert that keeps the greater score.
- Document status is clicked **until** it reads Live, not clicked once.
- Register items are the only rows the suite creates, and it deletes the ones it created.

## Definition of done

S1 passes when, in one run, driving only the UI:
1. Sign-in reaches the course with an `aal2` session.
2. All eleven modules the course sells (1 to 10 and 12) return a pass from
   `record_quiz_result`.
3. `end-user.html` shows every one of those modules as done.
4. The module 11 finale is unlocked by those passes.
5. `manager.html` shows that staff member's row as `11 / 11`.
6. No console errors and no CSP violations on any page visited, except the inline risk
   figure that ACTION-ITEMS already tracks as dead on every module page.

S2 passes when, in one run, driving only the UI:
1. `governance.html` loads with the 24 seeded documents.
2. Every AI-pack and GDPR-pack row reads Live.
3. Each of the four registers holds at least one item the test added.
4. An item's status cycles and an item's title edit both persist a reload.
5. "Documents ready or live" reads 24/24 and the register counts match the rows.
6. No console errors and no CSP violations.

## Gaps this spec forces, build before testing

1. **`set_module_progress` must go.** It is SECURITY DEFINER, executable by `anon` and
   `authenticated`, and writes `module_progress` from a client-supplied score with no
   answer checking. One REST call forges any completion, which defeats migration 0006 and
   makes the certificate issued this morning worthless as evidence. It is in no migration.
   Drop it, and delete the `localStorage` bridge in `end-user.js` that calls it, which is
   obsolete now that `quiz.js` writes through `record_quiz_result`.
2. **Capture the undocumented schema.** `governance_docs`, `governance_items`,
   `governance_acks`, `governance_state` and `ensure_governance_docs` exist only in the
   live project. A test that asserts against them needs them in the repo.
3. **`newPage` aborts every POST.** That guard stops a stray Netlify order, but it also
   stops sign-in. It needs to allow POSTs to the Supabase origin only.

## Gaps the first two runs found, fixed in the same pass

4. **`connect-src 'self'` blocked scoring in production.** The module pages and `cert.html`
   sit at the site root, not under `/portal/`, so the site-wide CSP applied: every call to
   `record_quiz_result` was refused on the live site and nowhere else. The course could not
   be completed by anybody. Fixed in `_headers`.
5. **Three progress systems disagreed.** `module_progress` (server), `aisw-quiz-m*`
   (localStorage scores) and `aisw-done-m*` (localStorage "mark complete", which gates the
   module 11 finale). The manager counted every `module_progress` row against a hardcoded
   11, which counted the finale and could never include module 1 — so 11/11 was unreachable
   by the eleven modules the course actually sells. Now: module 1 is server-graded when
   there is a session, the roster counts the eleven from `modules.js`, the certificate
   register lists the same eleven, and passing a quiz marks the module complete so the
   finale unlocks without hunting for a button.
