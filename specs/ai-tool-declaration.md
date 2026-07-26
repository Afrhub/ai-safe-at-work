# Spec — AI Tool Declaration

> **Status:** DRAFT · 2026-07-26 · not started
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

## Open questions for the founder

1. **Who decides?** The AUP owner, the Steering Group, or a named role per
   declaration? Currently the Tool Register has a free-text *Decision owner*
   with no routing behind it.
2. **Can staff see the register?** If someone can read that ChatGPT Personal is
   restricted before they ask, some declarations never get submitted — which is
   a good outcome, but it means publishing part of the register to the
   end-user portal.
3. **Auto-approve the trivial case?** A declaration for an already-approved
   tool, for public data only, is arguably a use case entry and not a decision.
   Routing it anyway is more defensible; skipping it is faster.
