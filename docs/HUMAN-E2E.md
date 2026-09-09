# Human end-to-end: JC and RA

Written 9 Sep 2026. The automated journeys prove every step below against the live site
on every board run; this is the same route walked by two real people with real mailboxes.
Tick each line as you go. Anything that does not behave as written is a bug: note the step
and what you saw.

Actors: **JC**, manager (account exists, 500 credits, temporary password issued by phone
18 Aug, no authenticator yet). **RA**, member of staff (no account yet).

## 1. JC signs in for the first time (5 min)
1. https://attest-ai.com/portal/login → email + temporary password → Sign in.
2. The page asks to set up an authenticator: scan the QR in Google Authenticator / 1Password /
   Authy, enter the 6-digit code. This is the one-time enrolment; every later sign-in asks for
   a code.
3. Lands on the Manager portal. Top right shows JC's name and "Manager".
4. Sign out, sign in again: password, then code. Lands on the Manager portal.

## 2. RA signs up (3 min)
1. https://attest-ai.com → the big **Sign up** → RA's email and a password → Create account.
2. Email arrives from no-reply@attest-ai.com. Click the link: it lands on attest-ai.com (not
   localhost), then asks RA to set up an authenticator, then returns to the front door.
3. RA signs in: password, code. Lands on the staff portal ("My learning"). Module 1 is open;
   modules 2 to 12 say RA is not on a team yet. Correct: nobody has bought RA a seat.

## 3. JC seats RA (2 min)
1. JC → Manager portal → Invite by email → RA's email → Invite.
2. Roster shows RA with 0/11. Credits went 500 → 499.
3. RA reloads the staff portal: modules are open.

## 4. RA does the course (45–60 min, or sample three modules)
1. Module 1 → knowledge check → pass. The score is recorded (green "Recorded" state).
2. Any two more modules the same way. Then, on a second device or a private window, sign in
   as RA and open the course: the same modules show complete (the record, not the browser).
3. cert.html for a passed module shows RA's name and the score; the register lists the passes.

## 5. JC watches it land (2 min)
1. Manager portal roster: RA at 3/11 (or 11/11 after the full course).
2. Governance dashboard: "AI literacy trained" reads 0% until RA has all eleven, then 100%.

## 6. JC publishes a policy, RA acknowledges (5 min)
1. Governance dashboard → Document pack → Acceptable Use Policy → click the pill until **live**.
   Also try one of the three GDPR documents that now has content (Employee Privacy Notice).
2. Staff acknowledgement reads 0/2 across 1 staff.
3. RA → staff portal → Company governance → both documents listed with Read → Acknowledge each.
4. JC reloads: 2/2, 100%.
5. JC → Governance Centre (16 sections) → Acceptable Use Policy editor → Publish. The toast must
   say "staff can now acknowledge it", and the dashboard row for the AUP must read live.

## 7. Registers (5 min)
1. Governance dashboard → Risk register → add a risk; Incident register → add an incident.
   Dashboard tiles: Open risks 1, Open incidents 1.
2. Governance Centre → Incidents → log one there too. Dashboard: Open incidents 2 (both
   screens count).
3. Delete both. Tiles back to 0.

## 8. Edge cases worth two minutes
- RA opens the certificate page in a second tab, leaves it an hour, then passes a module in the
  first tab: it records (token refresh), no "could not mark".
- JC opens the Governance Centre in two tabs, edits the same register in both, saves both: the
  second save is refused with "changed in another tab", nothing is lost silently.
- Sign out with the network off: still lands on the sign-in page and cannot get back in
  without a password.

## When something fails
Note the step number, what you expected, what you saw, and the time. Every portal page logs
to the browser console; a screenshot of the console with the step is enough.
