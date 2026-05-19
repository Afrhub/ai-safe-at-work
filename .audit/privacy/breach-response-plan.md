# Breach response plan

> **Reg basis:** GDPR Arts 33–34 · ISO/IEC 27001 A.5.24–26 · EU AI Act Art 73 · **Owner:** Founder · **Effective:** 2026-05-19

## Trigger

This plan activates the moment any of the following is suspected:

- Personal data we hold has been accessed, altered, lost, destroyed, or disclosed without authorisation.
- An AI vendor we use announces a security incident affecting their service.
- A site visitor reports content they believe to be personal data about them was exposed.
- A reader reports a course-content error that may cause material harm.
- A successful phishing / social-engineering attack against the business itself (founder or future staff).

## First 60 minutes — first responder actions

1. **Stop the bleeding.** Pause whatever is currently leaking; do NOT delete evidence.
2. **Note the time.** This is when "reasonable awareness" starts — the GDPR Art 33 72-hour clock starts ticking.
3. **Preserve evidence.** Screenshots, log files, the email or message that surfaced the issue. Save to a date-stamped folder.
4. **Stop using the affected channel** until investigated (e.g. don't reply to a phishing email; don't continue uploading to a compromised tool).
5. **Document the first-hour facts** in a fresh incident-log entry — what happened, when noticed, what done so far.

## Hours 1–24 — investigation

1. Identify which data, which subjects, which volume.
2. Identify root cause (or working hypothesis).
3. Identify whether the breach is likely to result in risk to rights and freedoms of natural persons. If yes → notification required.
4. Identify whether the breach is likely to result in HIGH risk. If yes → data subjects must be notified too.
5. Contact insurer (if PI / cyber policy active) — most policies require notice within 24h.
6. If legal advice is needed and there's no in-house counsel: contact retained adviser.

## Hours 24–72 — notification

1. If notification to supervisory authority is required:
   - UK: ICO at <https://ico.org.uk/for-organisations/report-a-breach/>
   - France: CNIL via <https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles>
   - Other member state: that state's supervisory authority
2. Submit notification in writing even if a phone call was made. Use the template in this file (below).
3. Communicate to affected data subjects if high risk (Art 34) — clearly, plainly, what happened, what we're doing, what they should do.
4. Update the incident log with every action and decision, with timestamps.

## Days 3–30 — remediation + lessons

1. Resolve the underlying cause; document the fix.
2. Verify no further unauthorised access occurred.
3. Conduct a post-mortem; record in `incident-log.md`.
4. Update controls / policies if findings warrant; record what changed.
5. If the supervisory authority asks follow-up questions, respond within their deadline.

## Long-term

1. Annual review of this plan to keep notification routes and contact details current.
2. Each incident's lessons are reviewed at the next quarterly content refresh.

## Notification template (to supervisory authority)

```
TO: [Supervisory authority name]
FROM: AI Safe@Work / [Controller legal name]
RE: Personal data breach notification under GDPR Art 33

1. Nature of the breach
[What happened, plain English. Specific timeline.]

2. Categories and approximate number of data subjects concerned
[Best estimate. State uncertainty if uncertain.]

3. Categories and approximate volume of personal data records concerned
[Best estimate. State uncertainty if uncertain.]

4. Likely consequences of the breach
[What harm could realistically result. Be honest, not minimising.]

5. Measures taken or proposed
[What we have done to address; what we will do.]

6. Contact point
[Name, role, email, phone of the person handling.]

7. Other relevant information
[Anything else the authority needs.]

Sent at: [datetime]
Sent by: [name and role]
```

## Notification template (to data subjects, if Art 34 high-risk)

```
Subject: Important notice about your information

Dear [name],

On [date], we became aware that [brief plain-English description of what happened]. The information involved was [specific categories].

What this means for you:
[Practical consequences and what they should watch for.]

What we are doing:
[Concrete actions in plain English.]

What you can do:
[Specific actionable steps — change password, watch for phishing, contact us, etc.]

If you have questions, please [contact route] and we will respond within [SLA].

We are sorry this happened. We have notified [supervisory authority] and are working with [any other parties].

Yours,
[Name and role]
```

## Contacts kept current

| Role | Name | Channel |
|---|---|---|
| Internal owner | Founder | (current) |
| External legal counsel | TBD | TBD |
| Insurance — PI / cyber | TBD | TBD |
| Hosting incident channel | per vendor status page | per vendor |
| ICO (UK) | helpline 0303 123 1113 | <https://ico.org.uk> |
| CNIL (FR) | +33 1 53 73 22 22 | <https://www.cnil.fr> |

## Test

This plan is tested via tabletop exercise once per year. Result recorded in `.audit/security/annual-review-YYYY.md`.
