# Spec — AI Tool Declaration

> **Status:** DRAFT · 2026-07-26 · not started · founder questions answered same day
> Scoped after the AI Tool Register shipped (`88be557`). Read that first: this
> feature exists to feed it.

---

## Objective

A member of staff wants to use an AI tool that is not on the AI Tool Register.
Today the only route is to find whoever owns governance and ask them in person.
This gives that request a front door, a decision, and a record — and on
approval, writes the rows the rest of the platform already knows how to use.

It is a **governance workflow, not a technical control**. It cannot know that
someone has signed into ChatGPT with a personal address, and must not pretend
to. It records that someone asked, what was decided, by whom, and when.

---

## Why this shape

The registers now hold the answer but nothing routes a question to them. The
Tool Register solved *"where does a personal ChatGPT account live?"*. This
solves *"how does it get there, without the governance owner having to notice
it first?"* — which is the same failure the sales funnel had: nothing on the
site emailed anyone, so every order waited to be spotted.

---

## The flow

1. **Submit** — staff member opens *Declare a tool* from the end-user portal.
2. **State** the tool name, the account type they would use, the business
   purpose in one sentence, and the most sensitive data category involved.
3. **Nominate** a supplier if there is one. Personal accounts have none; the
   form must not require it.
4. **Answer** a short risk questionnaire (see below).
5. **Submit** → status `Awaiting decision`. The declaration appears in the
   Governance Centre attention list immediately.
6. **Decide** — the governance owner opens it, records Approve / Approve with
   conditions / Reject, a named decision-maker, and conditions if any.
7. **On approval, it writes:**
   - an **AI Tool Register** entry (status carried from the decision, account
     type and permitted-data ceiling carried from the form)
   - a **Use Case Register** entry, its `tool` already referencing the row above
   - a **Risk Assessment** stub linked to that use case, **only when** the
     declared data category is Confidential business or higher
8. **On rejection**, it writes a Tool Register entry with status `Not approved`
   and the reason. A rejection is evidence; it must not vanish.

---

## Risk questionnaire

Five questions, all answerable by a non-specialist. Deliberately short: a long
form gets abandoned and the tool gets used anyway, which is the outcome this
feature exists to prevent.

1. What data would you put into it? *(same categories as the Use Case Register)*
2. Would anything you get out of it reach a customer, or affect a decision
   about a person?
3. Is there a company account available, or would this be a personal one?
4. Does anyone else in the business already do this task with an approved tool?
5. Could you do this task without AI? *(not a trick question — the honest
   answer is sometimes yes, and that is the cheapest possible mitigation)*

---

## Data model

New key `declarations` in the same key/value store as the other registers
(`dbGet`/`dbSet`, Supabase `governance_state`). One array of records:

| field | type | notes |
|---|---|---|
| `id` | string | `D-` prefix, same generator as the other registers |
| `submittedBy` | staff id | falls back to a typed name where auth is off |
| `submittedAt` | ISO date | |
| `toolName`, `edition` | string, select | same options as the Tool Register |
| `purpose` | text | one sentence |
| `dataCategory` | select | drives whether a Risk Assessment stub is created |
| `vendorId` | ref, optional | blank for personal accounts |
| `answers` | object | the five questions |
| `status` | select | `Awaiting decision` / `Approved` / `Approved with conditions` / `Rejected` |
| `decidedBy`, `decidedAt`, `conditions`, `reason` | | |
| `createdToolId`, `createdUseCaseId` | ref | what it wrote, so the trail is two-way |

---

## Constraints that shape the build

- **No email yet.** SMTP is still an open launch prerequisite, so a declaration
  cannot notify anyone by mail. It must surface in the Governance Centre
  attention list, which is already the screen people are told to work top-down.
  When SMTP lands, the digest is the natural carrier — no redesign needed.
- **CSP `script-src 'self'`** blocks inline handlers. Use `data-act` and the
  existing delegated dispatcher, as everything else in `aimp.js` does.
- **Staff-facing, not manager-facing.** Submission belongs in
  `portal/end-user.html`; decision belongs in the manager portal. These are
  different files with different audiences.
- **Idempotency.** Deciding twice must not create two Tool Register rows.
  Guard on `createdToolId`.

---

## Explicitly out of scope

- Any detection of actual tool usage. No browser monitoring, no endpoint agent,
  no CASB. Advising on Purview / Defender / Netskope / Zscaler is
  **consultancy**, and belongs in that conversation, not this platform.
- Counting how many people use an unapproved tool. The platform cannot source
  that number and must not display it.
- Blocking anything. The platform records decisions; it does not enforce them.

---

## Definition of done

1. A declaration submitted from the end-user portal appears in the Governance
   Centre attention list within one render, with no page reload.
2. Approving one creates exactly one Tool Register row and one Use Case row,
   the use case's `tool` resolves to the new tool, and the attention item
   clears itself.
3. A declaration with data category `Confidential business` or higher also
   creates a Risk Assessment stub linked to that use case; one below it does
   not.
4. Rejecting one creates a Tool Register row with status `Not approved` and the
   recorded reason, and creates no use case.
5. Deciding the same declaration twice creates no duplicate rows.
6. All of the above survive a page reload (i.e. are persisted, not in memory).
7. No console errors, and the CSP is not weakened to make any of it work.
8. Playwright covers 1–6 in `tests/tool-declaration.mjs`.

---

## Founder decisions (answered 2026-07-26)

### 1. Who decides — resolved: a real person, not a typed name

> *"Should link to the manager or a user when their details are entered."*

**Done already, ahead of this build.** `Decision owner` on the AI Tool Register,
plus `Use case owner` and `Risk owner`, are now references to staff records
rather than free text. A name typed before that person was invited is kept and
shown as *"not a team member"* — flagged, not discarded. An approved tool with
no owner now raises an item in the Governance Centre, because a decision nobody
holds is a governance gap.

The declaration workflow inherits this: `decidedBy` is a staff reference, and
the same picker is reused.

### 2. Staff can see the register — resolved yes, but it is not a front-end job

> *"Yes — it's good for the register to be visible to users of the company."*

Agreed, and it should shorten the queue: someone who can see that ChatGPT
Personal is restricted may never need to declare it. **Two things block a
simple implementation, both found while scoping this and neither previously
recorded:**

- **`governance_state` is not in any migration.** The whole manager portal —
  every register, the policy, the acknowledgements — lives in a table whose
  schema and RLS exist only in the running Supabase project. Nothing in the
  repo reproduces it. Before staff can read a manager's row, there has to be a
  policy allowing it, and there is nowhere to write that policy today.
- **`dbGet` falls back to `localStorage` on any error, including a permission
  denial.** A blocked read is indistinguishable from an empty register, so an
  RLS mistake would not surface as a failure — it would silently move a
  customer's governance data into their own browser. This wants fixing on its
  own merits, ahead of any staff-read feature.

There is also a **second, parallel document system**: the end-user portal reads
`governance_docs` and writes `governance_acks`, while the manager portal's
policy tracks its own acknowledgements inside `governance_state`. Two stores,
two acknowledgement trails, no link. Deciding which is authoritative is a
prerequisite, not a detail.

**Sequenced accordingly:** make the storage layer honest → put
`governance_state` under migration with an explicit read policy → then a
read-only register view in `portal/end-user.html`.

### 3. Auto-approve the trivial case — resolved yes, but still write the record

> *"Sounds reasonable."*

Auto-approve where the tool is **already on the register as Approved** and the
declared data category is **Public data**. It still writes a full declaration
record with `status: Approved`, `decidedBy: system`, and a reason of
*"auto-approved: already-approved tool, public data only"*, plus the Use Case
Register entry.

Speed without losing the evidence, which is the whole product. Any other
combination routes to a person.

---

## Build order

1. Storage honesty: stop `dbGet`/`dbSet` swallowing errors into localStorage.
2. `governance_state` into a migration with an explicit read policy for staff.
3. Read-only register view in the end-user portal.
4. The declaration workflow itself, per the flow above.

1 and 2 are prerequisites for 3. 4 can be built before 3 if needed — it does
not depend on staff being able to read the register, only on the register
existing, which it does.
