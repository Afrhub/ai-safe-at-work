# Spec — Runbook Phase 5: first real customer

Written 2 Sep 2026. Objective: a manager invites a member of staff, the invite **arrives**,
the staff member sets up two-step sign-in, completes a module, and the manager sees it on
the roster. JC is the first real manager; everything below is proven with the dedicated
test accounts first so his run is a formality.

## Ground truth at spec time

- JC: manager, 500 credits, **no authenticator, never signed in from a browser** (the
  18 Aug sign-in was the agent verifying his temp password by curl).
- `invite-seat` (Edge Function v1, deployed 12 Jul) existed only in the live project. Its
  `REDIRECT_TO` still points at `aisafework.netlify.app`.
- Email delivers since Phase 2 (2 Sep). Test manager `e2e-manager@` has 5 credits, 2 seats
  (`e2e-staff@`, `e2e-newstarter@`).

## Definition of done

| # | Outcome | Proof |
|---|---|---|
| A | `invite-seat` source is in the repo, reviewed, and the deployed version matches it, with the invite link landing on `attest-ai.com` | file in `supabase/functions/invite-seat/`; deployed hash = repo |
| B | A manager inviting a **new** email causes an invite email to be sent through Resend, an `auth.users` row, a seat, and one credit spent | auth log shows `user_invited` + SMTP duration; DB shows seat + credits 5→4 |
| C | The invited person signs in, is forced to enrol an authenticator, completes a module, and appears on the manager's roster with progress | Playwright journey (fixture stands in for the email click, as in onboarding) |
| D | Repeatable suite: manager seats an existing account, roster shows it, seat removal returns the credit | `tests/suites/e2e-invite.mjs`, green, leaves state as found |
| E | JC's own run | **His**, not the agent's: his first sign-in enrols *his* authenticator (doctrine rule 7). Everything he will touch is proven by A–D |

## Status 2 Sep 2026

A ✅ v3 deployed, repo matches. B ✅ auth log `user_invited` 200 / 1.08 s, credits 5→4, seat present.
C ✅ enrolment forced, module 2 10/10, roster 1/11, no CSP/page errors. D ✅ `e2e-invite` 5/5.
E — JC's, pending his sign-in.

## Out of scope

Reading the invite email itself (no mailbox; the fixture confirms the account as Phase 2's
proof did). Stripe (Phases 0/3).
