# Rate-limiting posture — v2 platform

> Date: 2026-05-31
> Scope: every page under `/v2/*` of the AI Safe@Work platform.
> Author: Founder.
> Posture: Goal directive asked for rate limiting on API calls and DB calls. **v2 has neither.** This document records that fact for procurement-readiness and lays out the rate-limit controls that DO exist at the layers v2 actually uses.

---

## Summary

| Surface | Present in v2? | Rate-limit applied | Rationale |
|---|---|---|---|
| Server-side API endpoints | **No** | N/A — surface does not exist | Static-only site. No backend, no Lambda, no edge function. |
| Database connections | **No** | N/A — surface does not exist | No DB. No KV store. No object store accessed at runtime. |
| Same-origin static asset fetches (HTML + CSS + JS + JSON) | Yes | Layered: browser HTTP cache (`max-age=300, must-revalidate`) + Netlify edge cache + Cloudflare in front (when canonical domain ships) | Static assets only. Edge caching naturally absorbs read bursts. |
| Browser `localStorage` writes | Yes | **Client-side throttle: max 10 writes per second per browsing context** (`assets/v2.js`) | Defensive against a buggy or malicious script trying to fill the user's storage quota or DoS the storage API. |
| Third-party reads (Google Fonts CSS + woff2) | Yes | Browser HTTP cache; long woff2 cache lifetime; CSP-restricted scope | Vendor-managed; we cannot rate-limit Google's CDN. |

**Conclusion:** No part of the v2 surface initiates outbound API calls or DB queries. Rate-limiting in the classical sense (token bucket on `/api/*` etc.) is therefore not applicable. Where state changes ARE possible (the `localStorage` write path) a client-side throttle is implemented.

---

## What rate-limits exist and where

### 1. Client-side localStorage throttle (defensive)

Implemented in `v2/assets/v2.js` → `safeWrite()`:

```js
var MAX_WRITES_PER_SEC = 10;
var lastWriteTimes = [];
function safeWrite(key, value) {
  try {
    var now = Date.now();
    lastWriteTimes = lastWriteTimes.filter(function (t) { return now - t < 1000; });
    if (lastWriteTimes.length >= MAX_WRITES_PER_SEC) {
      console.warn('[v2] localStorage write rate-limit triggered, dropped write to ' + key);
      return false;
    }
    lastWriteTimes.push(now);
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}
```

**Why 10/sec:** Three legitimate writes happen in the worst-case user flow (mark-complete → progress save → banner dismiss). 10/sec leaves headroom for legitimate use while catching any runaway loop that would otherwise hit the 5–10 MB browser storage cap.

**Failure mode:** Excess writes are dropped, **never queued**. There is no replay path. A `console.warn` fires for observability during local debugging.

**Limitations:** This is a defence in depth, not a security boundary. A determined attacker who already controls the page's JavaScript can bypass it (they can call `localStorage.setItem` directly). The CSP keeps unauthorised scripts out — that is the actual security control.

### 2. Edge cache (CDN-layer rate absorption)

Netlify's edge cache + Cloudflare's edge cache (when canonical domain moves) absorb burst reads on static assets:

```
/v2/*       Cache-Control: public, max-age=300, must-revalidate
```

A 300-second cache means a high-volume client (or a small DDoS) hits the cache and never reaches the origin. Effective rate-limit at the edge layer without explicit token-bucket logic.

### 3. HTTP/2 + HTTP/3 connection limits

Inherited from the host (Netlify, then Cloudflare). No project-level config required.

### 4. CSP-enforced connection restriction

```
connect-src 'self'
```

The browser refuses any `fetch()`, `XMLHttpRequest`, `EventSource`, `WebSocket` or `Beacon` to anywhere other than the same origin. This is not a rate-limit but it removes the ability of a hostile script to fan out requests to arbitrary backends from the user's browser.

---

## What is explicitly **NOT** present in v2

The MVP scope (per `DOCTRINE.md § Course content v2`) defers all of the following to roadmap. If/when any of them ship, this document gets a new section with the rate-limit configuration:

- Server-side API endpoints (would need request-per-second + per-IP + burst limits)
- Database (Postgres / SQLite / Supabase / Firestore — none present)
- Authentication endpoints (would need brute-force protection, lockout-after-N-failures)
- Webhook ingest (would need signature verification + replay protection + per-source throttle)
- File upload endpoints (would need size/rate caps)
- Real-time channels (WebSockets / SSE — none present)
- Email sending (no transactional email; no SMTP; no SendGrid integration)
- Payment endpoints (no Stripe / Lemon Squeezy / Paddle integration)
- Search indexer (no full-text or vector search — local in-memory only)

If any of these arrive, add the rate-limit definition to this file at the time the feature lands, not after.

---

## Roadmap — explicit rate-limit triggers

| Trigger | Rate-limit work needed |
|---|---|
| First API endpoint shipped (e.g. a contact form backend) | Token-bucket or fixed-window per-IP limit at the edge. Recommended: Cloudflare WAF Custom Rules + Cloudflare Rate Limiting. Budget: 60 requests / minute / IP for unauthenticated, 600 for authenticated. |
| First DB query exposed to user input | Connection pool cap + per-query timeout + per-tenant query budget. Database choice will dictate specifics. |
| Authentication endpoint | Per-IP 5 failed logins → 15-minute lockout; per-account 10 failed logins → 1-hour lockout + email alert. |
| Webhook receiver | Per-source signing-key verification + 1000 events / minute / source token, with idempotency check on event ID. |
| Cert-generation endpoint (porting v1 functionality server-side) | 5 cert generations / hour / IP; per-cert idempotency on (user, module, score). |

Each will be authored as `.audit/security/rate-limit-<surface>-<YYYY-MM-DD>.md` at the time of shipping, not before.

---

## Verification

The static-only posture is verifiable by inspection:

```bash
# Should return ZERO hits — no API surface defined in code.
grep -rE "fetch\(['\"]https?://|XMLHttpRequest|new WebSocket|new EventSource" v2/assets/

# Confirm same-origin fetches only.
grep -nE "fetch\(" v2/assets/v2.js
# Expected output: only `fetch(MANIFEST_URL, ...)` with MANIFEST_URL = 'modules.json' (relative).

# Confirm no DB-driver dependency.
grep -rE "supabase|firebase|firestore|pg\b|mysql|sqlite|mongodb|redis" v2/

# Confirm the throttle constant matches this document.
grep "MAX_WRITES_PER_SEC" v2/assets/v2.js
# Expected: 10
```

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | Founder | 2026-05-31 |
| Verdict | **No API surface, no DB surface, so classical rate-limiting does not apply to v2. Client-side localStorage throttle (10/sec) implemented as defence-in-depth. Edge cache absorbs read bursts. This file will be re-evaluated the day any of the deferred surfaces is introduced.** | — |
| Next review | At the time of shipping any of the deferred surfaces above, OR Q3 2026 quarterly refresh, whichever is sooner. | — |
