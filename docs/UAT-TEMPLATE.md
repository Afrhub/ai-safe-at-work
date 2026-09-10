# Governance dashboard: cross-section dependencies, and the UAT template

Written 10 Sep 2026 from the code. Companion to `docs/HUMAN-E2E.md` (the narrative walk); this is the checklist.

## Part 1. What feeds what

Every tile and list below is derived from one or two tables. Change the source, the tile moves; nothing else does.

| Tile or screen | Reads | Written by | Rules and gotchas | Also shows in |
|---|---|---|---|---|
| Governance dashboard · Documents ready or live | governance_docs.status for this manager (24 seeded rows, 18 staff-facing + 6 internal) | Pill on the dashboard: draft → ready → live → draft. Seeded on first visit by ensure_governance_docs (manager, authenticator). | A staff-facing document with no content link cannot go live. Internal records can. | Staff portal lists only live staff-facing documents of the staff member's manager. |
| Governance dashboard · AI literacy trained | seats × module_progress rows with status done for the eleven sold modules (1–10, 12) | Seat: Manager portal → Invite (invite-seat → assign_seat, one credit). Progress: a seated learner passing a module's knowledge check (record_quiz_result). | Learner must hold a seat and have an authenticator; module 1 records for anyone signed in but does not count without the other ten. | Manager portal roster (n/11 per person); the learner's certificate page and register. |
| Governance dashboard · Staff acknowledgement | governance_acks × live staff-facing documents × seats | Staff portal → Company governance → Acknowledge (one row per person per document, only for a live document of their own manager). | Denominator = seated staff × live staff-facing documents. Internal records never count. Unpublishing then republishing keeps existing acknowledgements. | Staff portal badge "n awaiting"; the Governance Centre shows its own, separate count (see below). |
| Governance dashboard · Open risks / Open incidents | governance_items (dashboard registers) plus the Governance Centre's risk and incident registers in governance_state | Dashboard registers (Risks, Incidents, Use cases, Vendors) or the Centre's Risk Register / Incident Reports sections. | Open = status open (risks) or not closed (incidents); Centre entries count unless their status reads closed, resolved, treated, accepted or retired. | Centre dashboard tiles show only the Centre's own registers. |
| Governance Centre · Acceptable Use Policy publish | aup-status in governance_state (version, published, date) | Centre → Acceptable Use Policy → Publish. | Publish also sets the dashboard's Acceptable Use Policy row to live (ready when unpublished). If the mirror fails the toast says so and the dashboard row must be set by hand. | Dashboard document pack; staff portal (as a live document). |
| Governance Centre · Staff & Sign-off | staff and acks lists inside governance_state | Centre → Staff & Sign-off (typed names and emails). | This list is NOT the platform's seats. A person can be on it without a seat, and seated without being on it. The Centre's "n of m staff acknowledged" reads this list; the dashboard's percentage reads seats and governance_acks. | Nowhere else. Treat as the manager's own working list. |
| Governance Centre · Tool / Use Case / Risk registers, Assessments, Vendors, Vendor Risk, RACI, ToR, Objectives | one key each in governance_state, whole register per key | The Centre section itself. Every save carries the revision it loaded with; a second tab's save is refused with "changed in another tab". | Load failure locks saving until reload. Demo account writes to the browser session only. | Risks and incidents feed the dashboard totals (above); nothing else crosses. |
| Manager portal · Team roster | seats, module_progress (seated staff), credits on the manager's profile | Invite spends one credit and creates the seat; Remove returns it. | One seat per person across all managers; a manager or partner account cannot be seated. | Dashboard training stat uses the same rows. |
| Staff portal · My learning and Company governance | own module_progress; live staff-facing governance_docs of own manager; own governance_acks | Passing knowledge checks; acknowledging. | Without a seat: module 1 only, others say "not on a team yet". Needs authenticator. | Certificate page (own passes only). |

### The five things testers get wrong
1. **Two staff lists.** The Governance Centre's Staff & Sign-off is a typed list; the platform's team is the seats bought with credits. Only seats drive the dashboard's training and acknowledgement percentages.
2. **Two publish paths.** The dashboard pill and the Centre's AUP Publish both make the AUP live; the Centre's Publish also mirrors to the dashboard row. Other documents are dashboard-only.
3. **Two register homes.** Dashboard registers (governance_items) and Centre registers (governance_state) are separate stores; the dashboard totals add both.
4. **Internal records.** Six GDPR rows are the manager's and the ICO's; they never appear to staff or in the acknowledgement denominator.
5. **Authenticator everywhere.** Every record read or write needs the second factor. A password-only session sees empty lists, not errors.

## Part 2. UAT cases

Actors: **JC** manager, **RA** staff, **Buyer** anyone with the sandbox bank details, **Tester** whoever runs the negative tests. Result: P (pass), F (fail, note the step), B (blocked, say why).

### A. Access and identity

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| A1 | RA | No account | Home → Sign up → email + password → Create account | Confirmation email from no-reply@attest-ai.com within a minute; link lands on attest-ai.com, not localhost |  |  |
| A2 | RA | A1 done | Click the confirmation link | Authenticator enrolment screen; scan QR; code accepted; returns to the front door |  |  |
| A3 | RA | A2 done | Sign in with password, then code | Staff portal (My learning). Name shown top right |  |  |
| A4 | JC | Temporary password issued | Sign in with the temporary password | Forced authenticator enrolment, then the Manager portal |  |  |
| A5 | JC | A4 done | Sign out; sign in again | Password then code; Manager portal. Sign-out lands on the sign-in page even with the network off |  |  |
| A6 | RA | A3 done | Sign-in page → "Email me a sign-in link" | Email arrives; link lands on the site and signs in after the code |  |  |
| A7 | RA | A3 done | "Forgot your password?" → set a new one from the email | New password works; old one refused |  |  |
| A8 | Any | Signed in | Leave any portal page untouched for 10 minutes | Signed out to the sign-in page with an idle notice |  |  |
| A9 | Any | Signed in | Open /portal/manager as RA (staff) | Redirected to the staff portal; no manager data visible |  |  |

### B. Buying (sandbox until live keys)

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| B1 | Buyer | Sandbox keys in Netlify | Pricing → Foundation 1–25 → checkout with Stripe's test account 10-88-00 / 00012345 | Order received page; within a minute a manager account exists with 25 credits and the checkout name |  |  |
| B2 | Buyer | B1 done | Repeat B1 with the same email | Credits become 50 (a second purchase adds), not a second account |  |  |
| B3 | Buyer | B1 done | Stripe → endpoint → Resend the paid event | Response "duplicate"; credits unchanged |  |  |
| B4 | Buyer | B1 done, nominated manager entered at checkout | Complete a purchase naming a different manager email | The nominated address gets the account and credits, not the payer |  |  |

### C. Team

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| C1 | JC | Credits ≥ 1; RA has an account with no seat | Manager portal → Invite → RA's email | Roster shows RA at 0/11; credits down by one; RA's portal now opens all modules |  |  |
| C2 | JC | No account for the address | Invite a brand-new email | Invite email arrives; the person enrols an authenticator on first visit; roster shows them |  |  |
| C3 | JC | C1 done | Invite RA again | Refused: seat already assigned; credits unchanged |  |  |
| C4 | JC | C1 done | Remove RA's seat | Credit returned; RA's portal locks modules 2–12 again |  |  |
| C5 | JC | Credits = 0 | Invite anyone | Refused: no credits remaining; nothing created |  |  |
| C6 | JC | Another manager exists | Invite a person already seated under the other manager | Refused: managed by another account |  |  |

### D. Course

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| D1 | RA | No seat | Open module 1 and pass the check | Score recorded (green), no certificate offered for module 1 |  |  |
| D2 | RA | No seat | Open module 2 and submit the check | "This account is not on a team yet"; nothing recorded |  |  |
| D3 | RA | Seated (C1) | Pass modules 2 and 3 | Each shows Recorded; My learning shows 3/11 done |  |  |
| D4 | RA | D3 done | Sign in on a second device or private window; open the course | The same three show complete; the finale stays locked |  |  |
| D5 | RA | D3 done | Open cert.html?m=2 | Certificate with RA's name and the score; register lists 1, 2, 3 |  |  |
| D6 | RA | Seated | Leave a module page open for over an hour, then submit the check | Recorded (token refreshed), no "could not mark" |  |  |
| D7 | RA | Seated | Complete all eleven sold modules | Finale (module 11) unlocks; roster shows 11/11; dashboard training 100% for one seat |  |  |
| D8 | RA | Seated | Open a role track page (e.g. DPO) and pass its check | Recorded; a second device shows it |  |  |

### E. Governance dashboard

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| E1 | JC | First visit | Open the dashboard | 24 documents seeded: 15 AI, 9 GDPR; six GDPR rows marked internal |  |  |
| E2 | JC | E1 | Click the Acceptable Use Policy pill twice | draft → ready → live; "Documents ready or live" rises by one each step |  |  |
| E3 | JC | E1 | Try to set a GDPR internal record live | Allowed (manager's own record); staff acknowledgement denominator unchanged |  |  |
| E4 | JC | E1 | Try to set a staff-facing document with no content link live | Refused with "no content yet" |  |  |
| E5 | JC | E2, RA seated | Read Staff acknowledgement | 0/1 across 1 staff, 0% |  |  |
| E6 | RA | E5 | Staff portal → acknowledge the AUP | Dashboard reads 1/1, 100%; staff badge clears |  |  |
| E7 | JC | E6 | Set the AUP back to draft, then live again | Acknowledgement still 1/1 (kept by decision) |  |  |
| E8 | JC | E1 | Add a risk (open) and an incident (open) in the dashboard registers | Open risks 1, Open incidents 1; register tabs show counts |  |  |
| E9 | JC | E8 | Close the incident; mitigate the risk | Open incidents 0; Open risks 0 |  |  |
| E10 | JC | Network off | Reload the dashboard | "Dashboard unavailable" tile, no zeros pretending |  |  |
| E11 | JC | 50+ staff, 24 live docs (scale run) | Read Staff acknowledgement | Counts correct beyond 1,000 acknowledgement rows |  |  |

### F. Governance Centre (16 sections)

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| F1 | JC | Signed in | Open the Centre | Governance Centre dashboard: company name, policy status, risks, incidents |  |  |
| F2 | JC | F1 | Acceptable Use Policy → edit → Publish | Toast "Published as vX, staff can now acknowledge it"; dashboard AUP row reads live; staff portal lists it |  |  |
| F3 | JC | F2 | Unpublish | Dashboard AUP row reads ready; staff portal no longer lists it |  |  |
| F4 | JC | F1 | AI Tool Register → add a tool → Save | Row appears; reload shows it (saved to the database) |  |  |
| F5 | JC | F1 | Use Case Register → add; Risk Register → add an open risk | Centre dashboard risk count rises; Governance dashboard Open risks rises by one |  |  |
| F6 | JC | F1 | Incident Reports → log an incident | Governance dashboard Open incidents rises by one |  |  |
| F7 | JC | F1 | Risk Assessments, Vendor Due Diligence, Vendor Risk Score → one entry each | Each saves and survives reload; vendor risk shows a score |  |  |
| F8 | JC | F1 | Roles Matrix (RACI) → edit a cell; Steering Group ToR → set approver | Saved; reload shows the change |  |  |
| F9 | JC | F1 | Staff & Sign-off → add a person | Appears in the Centre's count only; Governance dashboard seats unchanged |  |  |
| F10 | JC | Two tabs open on the Centre | Edit the same register in both; save both | Second save refused: "changed in another tab"; nothing lost; reload shows the first save |  |  |
| F11 | JC | F1 | Open any editor; press Escape; Tab around | Escape closes; focus stays inside while open and returns to the opener after |  |  |
| F12 | JC | Network off | Reload the Centre, then try to save | Banner: records could not be loaded; saving switched off until reload |  |  |
| F13 | JC | F1 | Manage → Team / Course / Templates / Updates | Each opens; Templates links open the template pages with a working Print button |  |  |

### G. Staff portal

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| G1 | RA | Seated, AUP live | Company governance | Lists the AUP with Read and Acknowledge; badge "1 awaiting" |  |  |
| G2 | RA | G1 | Acknowledge | Button becomes Acknowledged; a second click is impossible |  |  |
| G3 | RA | Employee Privacy Notice live | Read → template page | Opens; Print / Save as PDF works |  |  |
| G4 | RA | Seated | Module Progress section | Matches My learning and the manager roster |  |  |

### H. Security and resilience (negative tests)

| ID | Actor | Precondition | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|---|
| H1 | Tester | Password-only token (no authenticator step) | Call any record table or RPC with it | Empty results; RPCs answer "authenticator required"; own profile still readable |  |  |
| H2 | Tester | RA's session | Edit the stored session's user id in devtools; open cert.html | Still shows RA's own passes only |  |  |
| H3 | Tester | Any | POST to /.netlify/functions/stripe-webhook with a fabricated paid event | 400 bad signature; nothing provisioned |  |  |
| H4 | Tester | Signed out | Open /portal/manager, /portal/governance, /cert.html | Bounced to sign-in / course page |  |  |
| H5 | Tester | Any | Sign-in URL with ?next=/\evil.com | Not redirected off-site |  |  |
| H6 | Tester | Any | Open /docs/, /HANDOFF.md, /supabase/, /tests/ | 404 |  |  |
| H7 | Tester | Manager session | Call remove_seat / assign_seat for a user of another manager | Refused |  |  |

## Sign-off

| Role | Name | Date | Cases passed / total | Signature |
|---|---|---|---|---|
| Manager (JC) |  |  |  |  |
| Staff (RA) |  |  |  |  |
| Product owner |  |  |  |  |
