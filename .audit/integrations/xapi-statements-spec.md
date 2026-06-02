# xAPI (Tin Can) statement specification — AI Safe@Work v2

> Closes `DOCTRINE.md § Procurement-readiness gates → Gate 4` (the xAPI half).
> Companion implementation: `v2/assets/xapi-adapter.js`.
> Companion buyer-config template: `xapi-config-template.json`.

---

## Purpose

This document is the contract between AI Safe@Work and any Learning Record Store (LRS) a buyer points the adapter at. It is what a buyer's LRS team needs to validate inbound statements, attach them to their reporting layer, and add the activity definitions to their Activity Provider catalogue.

xAPI version: **1.0.3**

---

## Endpoint + auth

The adapter POSTs every statement to:

```
{endpoint}/statements
```

with headers:

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `X-Experience-API-Version` | `1.0.3` |
| `Authorization` | `Basic <base64>` OR `Bearer <token>` per buyer config |

The buyer configures the endpoint + auth via one of three mechanisms — see `xapi-config-template.json` and `v2/assets/xapi-adapter.js` comments. The adapter rejects non-HTTPS endpoints at runtime.

---

## Statement catalogue

### Activity IDs

| Activity | URI |
|---|---|
| Course | `https://aisafeatwork.org/xapi/v2/course` |
| Module N (N = 1..11) | `https://aisafeatwork.org/xapi/v2/module/N` |

The course activity is the parent of every module activity in `context.contextActivities.parent`.

### Verbs used

| Verb | URI | When fired |
|---|---|---|
| `experienced` | `http://adlnet.gov/expapi/verbs/experienced` | Currently reserved; not fired by default. Buyers who want page-view tracking can opt in by listening for the `aisw:page` event and calling `AISW_XAPI.moduleExperienced(n, locale)`. |
| `completed` | `http://adlnet.gov/expapi/verbs/completed` | Fired the first time a learner clicks "Mark this module complete" on a given module within a session. |
| `passed` | `http://adlnet.gov/expapi/verbs/passed` | Fired when the 11th module is marked complete AND (for module-11 self-assessment) the learner self-reports ≥ 80%. |
| `failed` | `http://adlnet.gov/expapi/verbs/failed` | Reserved. Currently not fired by the v2 adapter because module 11 self-assessment is a self-graded reveal pattern and there is no negative-score branch. Will fire when module 11 is upgraded to a scored MCQ engine. |
| `answered` | `http://adlnet.gov/expapi/verbs/answered` | Reserved for the post-MVP MCQ engine on module 11. |

### Canonical statement — module completion

```json
{
  "actor": {
    "objectType": "Agent",
    "name": "AI Safe@Work learner",
    "account": {
      "homePage": "https://aisafeatwork.org/v2/",
      "name": "anonymous-or-buyer-supplied-id"
    }
  },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed",
    "display": { "en-US": "completed" }
  },
  "object": {
    "objectType": "Activity",
    "id": "https://aisafeatwork.org/xapi/v2/module/3",
    "definition": {
      "name": { "en-US": "AI Safe@Work — v2 module 3" },
      "type": "http://adlnet.gov/expapi/activities/lesson"
    }
  },
  "timestamp": "2026-06-02T12:34:56.789Z",
  "context": {
    "platform": "AI Safe@Work v2",
    "language": "en",
    "contextActivities": {
      "parent": [
        {
          "id": "https://aisafeatwork.org/xapi/v2/course",
          "objectType": "Activity"
        }
      ]
    }
  }
}
```

### Canonical statement — course passed

```json
{
  "actor": { /* same shape as above */ },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/passed",
    "display": { "en-US": "passed" }
  },
  "object": {
    "objectType": "Activity",
    "id": "https://aisafeatwork.org/xapi/v2/course",
    "definition": {
      "name": { "en-US": "AI Safe@Work — v2 course" },
      "type": "http://adlnet.gov/expapi/activities/course"
    }
  },
  "result": {
    "score": {
      "scaled": 1.0,
      "raw": 100,
      "min": 0,
      "max": 100
    },
    "success": true,
    "completion": true
  },
  "timestamp": "2026-06-02T12:34:56.789Z",
  "context": {
    "platform": "AI Safe@Work v2",
    "language": "en",
    "contextActivities": {
      "parent": [
        {
          "id": "https://aisafeatwork.org/xapi/v2/course",
          "objectType": "Activity"
        }
      ]
    }
  }
}
```

---

## Actor identification

By default the actor has a generic `name` and an anonymous `account.name`. **The adapter never collects PII from the learner unless the buyer explicitly provides it**, in one of two ways:

1. **`window.AISW_XAPI_CONFIG.actor`** set by buyer-side LMS chrome before `xapi-adapter.js` loads. The buyer is responsible for ensuring the identifier is acceptable under their privacy regime (account vs mbox vs openid vs mbox_sha1sum).
2. **An xAPI-aware LMS** (Cornerstone, Watershed, Learning Locker, Yet Analytics, SCORM Cloud's xAPI side) injects the actor through its standard wrapper. The adapter detects this and uses it.

If neither path provides an actor, the adapter falls back to the anonymous default. **This is intentional** — anonymous learning data still has signal (aggregate completion rates per locale, per module drop-off, etc.) and respects the doctrine § Pre-launch security checklist 1.4 (don't collect data you don't need).

---

## CSP requirements

For the adapter to actually deliver statements to the LRS, the deploying party must:

1. Add the LRS origin to `connect-src` in the page's CSP. The default v2 CSP at `_headers` is `connect-src 'self'` — it blocks the LRS POST by design (this is the security boundary).
2. Decide whether the LRS origin should also be in `script-src` (only if the LRS injects wrapper JS) or `style-src` (only if the LRS injects CSS).

Recommended CSP for a Watershed-fronted deployment (example):

```
connect-src 'self' https://watershedlrs.com https://lrs.watershedlrs.com;
script-src  'self';
style-src   'self' https://fonts.googleapis.com;
```

A buyer who does not update CSP will see the adapter log a `console.warn` per statement post and the LRS will receive nothing. The course continues to work — no degraded UX.

---

## Validation steps for a buyer

1. Configure endpoint + auth via the chosen mechanism.
2. Update CSP `connect-src` to include the LRS origin.
3. Open `v2/index.html` in a private browsing window from the SCORM container or hosted location.
4. Click "Mark this module complete" on module 1.
5. Check the LRS dashboard for a `completed` statement against `https://aisafeatwork.org/xapi/v2/module/1` within 5 seconds.
6. Repeat for modules 2–11.
7. After module 11, check for a `passed` statement against `https://aisafeatwork.org/xapi/v2/course` with `result.score.scaled = 1.0`.

If any step fails, the cause is in one of:
- CSP `connect-src` (most common — log will say "blocked by CSP")
- Endpoint URL (typo / wrong path / wrong tenant)
- Auth (typo, expired token, wrong scheme)
- LRS schema strictness (very old LRSs may reject `account` actors)

---

## Roadmap

- Add `answered` statements when module 11 upgrades from self-reveal to scored MCQ (will allow per-question reporting).
- Add `cmi.interactions`-equivalent activity definitions for SCORM Cloud xAPI side.
- Add `result.duration` (ISO 8601 duration) on `completed` statements once we instrument page time-on-task.
- Add an opt-in `attempted` statement on first page view of each module for buyers who want raw enrolment data.

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-06-02 |
| Verdict | Spec is locked, adapter implements it, statement shapes are SCORM Cloud xAPI-side compatible. Ready for first LRS integration test. | — |
| Next review | First buyer LRS integration, OR Q3 2026 quarterly refresh, whichever is sooner. | — |
