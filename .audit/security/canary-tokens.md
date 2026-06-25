# Canary tokens rotation log

> Closes the open item in `DOCTRINE.md § Anti-scraping + AI-crawler controls → Open TODOs`.
> Canary tokens are read-only honeypot artefacts placed inside paid-surface HTML and inside the audit pack itself. Any external request for a canary URL or any external resolution of a canary DNS hostname is treated as a bot/scrape signal and is investigated within 24 hours.
> Rotation cadence: every 90 days, OR immediately on any incident-log entry that names canary-related activity.

---

## Canary inventory

| Token ID | Type | Location (in repo) | Placed | Last rotated | Next rotation due | Owner |
|---|---|---|---|---|---|---|
| AISW-CT-001 | HTML comment honeypot | `pricing.html` (deferred — page is currently `noindex`; token is staged in this log, drops into HTML the day pricing lifts to commerce) | — | — | At pricing.html lift from `noindex` | Founder |
| AISW-CT-002 | HTML comment honeypot | `msp.html` (same deferral logic) | — | — | At msp.html lift from `noindex` | Founder |
| AISW-CT-003 | DNS canary subdomain (`*.canary.attest-ai.com`) | Cloudflare DNS, resolves to a 403 page logged separately | — | — | At canonical-domain ship + Cloudflare cutover | Founder |
| AISW-CT-004 | `.audit/security/canary-tokens.md` self-reference (this file) | This file is `disallow:/.audit/*` in `robots.txt` AND 404-redirected on Netlify. Any 200 response in access logs against this path indicates that the bot-block layer has regressed. | 2026-06-02 | 2026-06-02 | 2026-09-02 | Founder |

---

## Token spec — what a canary looks like

A canary is one of three patterns:

1. **HTML comment with a unique pseudo-URL**, e.g.

   ```html
   <!-- AISW-CT-001 :: do not request :: hidden URL: /paid/canary/aisw-ct-001.html -->
   ```

   The pseudo-URL is **not** linked from anywhere a human would click. Only crawlers that parse comments or do naive URL extraction will hit it. Netlify returns 404 + logs the request; the access log is the alert.

2. **DNS subdomain that resolves to a known 403 page**. The 403 page name encodes the token ID. Bot that resolves the subdomain → 403 → alert.

3. **Self-referencing path inside `.audit/`**. The audit folder is supposed to be blocked at robots, Netlify redirect, AND `_headers` levels. Any successful retrieval signals that one of the three layers regressed. This file IS itself token AISW-CT-004.

---

## Alert workflow

1. **Trigger** — Netlify access log (or Cloudflare log post-migration) shows a request for any canary URL, OR a DNS resolution for a canary subdomain.
2. **Triage** — Within 24 hours, the founder pulls the IP / ASN / UA / referrer of the requester and pastes into `.audit/security/incident-log.md` as an incident draft.
3. **Classify** — Three buckets:
   - Known good-faith crawler (Google, Bing, ChatGPT-User) → log + close, refine canary placement.
   - Unknown crawler → keep watching for 7 days, escalate if pattern grows.
   - Active scraping or data-exfiltration attempt → invoke `breach-response-plan.md`.
4. **Document** — Any alert + outcome goes into `.audit/security/incident-log.md` with the canary token ID as the cross-reference.
5. **Rotate** — Every confirmed alert rotates the affected token AND the 90-day rotation timer for all tokens.

---

## Rotation procedure

1. Generate the new token ID (`AISW-CT-NNN`, incrementing).
2. Place the new comment / DNS entry / file marker.
3. Remove the old token from the HTML / DNS / file.
4. Update the inventory table above with the new IDs + dates.
5. Commit + push. (This change is, by definition, a security-relevant change; pre-launch checklist auto-applies.)

---

## Rotation log

| Date | Tokens rotated | Reason | Operator |
|---|---|---|---|
| 2026-06-02 | AISW-CT-004 (created) | Initial creation of this rotation log per doctrine § Anti-scraping. | Founder |

---

## Open items

- AISW-CT-001 + AISW-CT-002 wait on `pricing.html` and `msp.html` lifting from `noindex`. Staged in this file.
- AISW-CT-003 waits on canonical domain ship + Cloudflare DNS cutover.
- All three are conditional triggers on the pre-launch checklist evidence log; when they ship, this file gets a new row and the checklist gets a fresh entry.

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Owner | Founder | 2026-06-02 |
| Next review | 2026-09-02 (90-day rotation) OR sooner on any incident | — |
