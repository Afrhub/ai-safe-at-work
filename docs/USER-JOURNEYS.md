# Attest AI, onboarding journeys and flows

Written 11 Aug 2026. Grounded in the live schema and the shipped code, not in an ideal
design. Where the built system does not yet do what the journey needs, it says so.

## The role model, as the database defines it

`profiles.role` carries a check constraint: `end_user`, `manager`, `reseller`. Exactly
three, nothing else is insertable. Two self-referencing foreign keys give the hierarchy:

```
reseller ──(profiles.reseller_id)──> manager ──(profiles.manager_id)──> end_user
```

- `manager_id` on an end_user names the manager who seated them.
- `reseller_id` names the reseller who owns the account.
- `credits_balance` sits on the manager and is spent one per seat.

Current population: 2 managers, 1 end_user, **0 resellers**. The reseller journey below
has never been walked by a real account.

Routing is `DASH` in `portal/assets/portal.js`:

| Role | Lands on |
|---|---|
| `end_user` | `../course.html` |
| `manager` | `manager.html` |
| `reseller` | `reseller.html` |

---

## 1. Manager

The paying customer. Buys for an organisation, runs governance, seats staff.

### Journey

Recognises an AI governance problem, evaluates, buys, stands up governance, rolls out to
staff, produces evidence for an auditor, renews annually.

### Flow

| # | Step | Mechanism | State today |
|---|---|---|---|
| 1 | Lands on the marketing site | `index.html`, nav Products / Course / Governance | Works |
| 2 | Evaluates | `governance.html` overview + `portal/demo.html` sample platform, no account | Works |
| 3 | Books a demo or buys | `demo.html` form, or `checkout.html` | Form works, **nobody is notified** |
| 4 | Pays | Stripe Bacs, `create-checkout-session` | **Blocked, no Stripe account** |
| 5 | Account provisioned | `stripe-webhook` on `async_payment_succeeded` calls `grant_credits` | Code ready, unreachable |
| 6 | Receives credentials | Supabase invite email | **Blocked, no SMTP** |
| 7 | First sign in | `portal/login.html`, password then forced TOTP enrolment | Works |
| 8 | Lands on the portal | `manager.html`, Governance Centre | Works |
| 9 | Builds governance | AI Tool Register, Use Cases, Risks, Vendor Due Diligence | Works |
| 10 | Publishes the policy | Acceptable Use Policy generated from the registers | Works |
| 11 | Seats staff | Team pane, `invite-seat`, spends one credit via `assign_seat` | **Blocked, no SMTP** |
| 12 | Tracks completion | Course pane, completion CSV | **No server-side source, see note** |
| 13 | Tracks policy sign-off | Staff and Sign-off | Partly, see note |
| 14 | Renews | Annual | Manual |

**Step 12 note.** Quiz results never reach the database. `quiz.js` writes to
`localStorage` and never calls `record_quiz_result`, and `quiz_keys` is empty. The
manager's completion view and the "records you can hand to an auditor" claim have no
server-side source.

**Step 13 note.** The manager roster reads `governance_state`; the end-user portal writes
`governance_acks`. Nothing links them, so a staff sign-off may never appear here.

### The gap worth naming

`stripe-webhook` makes the **buyer's email** the manager. In most organisations the person
who pays is in finance and the person who runs governance is not. There is no step where
the buyer nominates a different manager, and no way to hand the role over afterwards.

---

## 2. Reseller (MSP / partner)

Sells Attest AI to their own customers and manages them.

### Journey

Discovers the partner programme, applies, is approved, registers deals, converts them,
manages customer accounts, earns commission.

### Flow

| # | Step | Mechanism | State today |
|---|---|---|---|
| 1 | Finds the programme | `msp.html`, footer Explore, formerly a nav pill | Works |
| 2 | Enquires | `partner-enquiry` Netlify form | Form works, **nobody is notified** |
| 3 | Approved and created | Manual, service-role only | **No self-serve path, and no reseller has ever been created** |
| 4 | First sign in | `portal/login.html`, password then TOTP | Untested, no account exists |
| 5 | Lands | `reseller.html` | Untested |
| 6 | Registers a deal | `deal_registrations`, stage `registered` | RLS verified, scoped to own rows |
| 7 | Moves stage | `registered` → `qualified` → `won` / `lost`, check constraint | Verified |
| 8 | Customer becomes a manager | `profiles.reseller_id` links them | **No UI, no function. Manual only** |
| 9 | Sees commissions | `commissions`, read only | Verified read-only |
| 10 | Takes marketing collateral | Share card, pitch deck, standards map | Works |

### The gap worth naming

Step 8 is the whole point of a reseller and it does not exist in code. There is no path
from "reseller won a deal" to "a manager account exists with `reseller_id` set". Today
that is Alastair running SQL. The `reseller_id` column and the RLS are in place; the
mechanism that would populate them is not.

---

## 3. Basic user (end_user)

A member of staff told to do the training.

### Journey

Receives an invitation, signs in, takes the course, passes the quizzes, gets a
certificate, acknowledges the policy, refreshes annually.

### Flow

| # | Step | Mechanism | State today |
|---|---|---|---|
| 1 | Manager seats them | `assign_seat`, one credit | Works at the database level |
| 2 | Receives the invite | Supabase magic link | **Blocked, no SMTP** |
| 3 | First sign in | Magic link, no TOTP required for staff | Works when email works |
| 4 | Lands | `course.html` | Works |
| 5 | Reads module 1 | Free, ungated, linked from the course page | Works, verified signed out |
| 6 | Reads modules 2 to 12 | `course-gate.js` requires a session | Works, client-side only |
| 7 | Takes the quiz | 10 questions, 5 options, 80% pass | Works, but see note |
| 8 | Earns a certificate | `cert.html` | Renders, but from client-side state |
| 9 | Acknowledges the policy | End-user portal writes `governance_acks` | Works, but not visible to the manager |
| 10 | Refreshes annually | New policy version supersedes prior acknowledgements | Designed, untested |

**Step 7 note.** The answer key ships to the browser: every question carries `"correct": N`
in the page JSON. Scoring and pass/fail happen client-side and persist only to
`localStorage`. Clearing the browser erases the learner's record.

### The gap worth naming

The staff journey has no self-service entry at all. A member of staff who loses the invite
email cannot request another one without the manager, and password reset needs the same
SMTP that is missing.

---

## Other roles worth considering

Three exist in the schema. At least three more exist in reality and have no row.

### a. Admin / operator, exists today, undefined

Whoever holds the `SUPABASE_SERVICE_KEY`. Today this actor grants credits, creates
resellers, issues commissions, and provisions anything the missing automation would do.
It has no `profiles` row, no portal, and no distinct identity in `audit_log`, so
service-role actions are not attributable to a person. Worth defining before anyone other
than Alastair holds that key.

### b. Buyer who is not the manager, exists today, unhandled

See the manager gap above. Finance pays, governance runs it. Needs either a nomination
step at checkout or a transfer function afterwards.

### c. Auditor or assessor, does not exist, probably should

The product's central promise is evidence for an auditor. There is no read-only role that
could be given time-boxed access to one organisation's registers, policy versions and
completion records. Today the manager exports a CSV and emails it. A scoped read-only
auditor role would be a strong differentiator and fits the existing RLS model.

### d. Worth ruling in or out explicitly

- **Multiple managers per organisation.** `credits_balance` sits on a single manager row
  and `manager_id` points at one manager. A second manager, or holiday cover, has no
  representation. For a 50 staff customer that will come up.
- **Group or multi-entity customer.** A holding company with three subsidiaries is three
  managers with no parent. `reseller_id` is the only grouping and it means something else.
- **Instructor or content author.** Course content is edited in the repository. If anyone
  other than Alastair ever edits it, that is a role.

---

## What blocks every journey

One item appears in all three flows: **no custom SMTP**. It blocks manager credential
delivery, staff invitations, and every password reset. It is the single highest-leverage
fix in the system, and it depends on pointing `attest-ai.com` at Netlify first, because
SPF, DKIM and DMARC need a domain under your control.
