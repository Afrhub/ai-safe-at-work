# Anti-scraping verification — 2026 Q3

> Per doctrine § Anti-scraping verification. Both tests must pass. Run quarterly + on any change to robots.txt or tdm-policy.json.

**Run date:** 2026-05-19 (Q3 baseline, pre-launch of canonical domain)
**Runner:** Founder
**Target host:** <https://aisafework.netlify.app/> (interim) + <https://afrhub.github.io/ai-safe-at-work/> (GitHub Pages)
**Canonical target (future):** <https://attest-ai.com/>

---

## Test 1 — citation engines reach free core

Goal: confirm citation / answer-engine crawlers fetch + cite our free content.

| # | Engine | Prompt | Pass criterion | Result | Notes |
|---|---|---|---|---|---|
| 1 | ChatGPT | `Read https://aisafework.netlify.app/module-3.html and list the 9 categories of data that should never go into a public AI tool.` | Returns 9 categories AND shows URL as a source link | **PENDING** — run after DNS settles | Re-run on canonical domain post-launch |
| 2 | Claude | Same prompt | Same | **PENDING** | |
| 3 | Perplexity | Same prompt or browse to perplexity.ai + ask | Returns categories with URL in source pills | **PENDING** | |
| 4 | Google | Search `site:aisafework.netlify.app "never-paste"` | Module 3 appears | **PENDING** — Google indexing takes 2–6 weeks for new domain | |
| 5 | Bing | Same search | Module 3 appears | **PENDING** | |

**Test 1 status:** **NOT YET RUN** — first execution scheduled after canonical domain (`attest-ai.com`) resolves + Google + Bing have had 4 weeks to index.

---

## Test 2 — rules present and correct on served files

Goal: confirm published `robots.txt` and `tdm-policy.json` contain intended rules (no deploy regression).

| # | URL | What to verify | Result | Detail |
|---|---|---|---|---|
| 1 | `/robots.txt` | `User-agent: GPTBot` followed by `Disallow: /` (training-bot block site-wide) | **PASS** | Verified via `curl` against Netlify deploy 2026-05-19 |
| 2 | `/robots.txt` | `User-agent: ChatGPT-User` followed by `Disallow: /paid/` and `Allow: /` (citation-bot allowed on free, blocked on paid) | **PASS** | |
| 3 | `/robots.txt` | `User-agent: CCBot` → `Disallow: /` (Common Crawl block — indirect training-data protection) | **PASS** | |
| 4 | `/robots.txt` | `Sitemap: https://attest-ai.com/sitemap.xml` line present | **PASS** (note: sitemap URL hard-codes canonical domain, not Netlify deploy URL — intentional for canonical move) | |
| 5 | `/tdm-policy.json` | Returns valid JSON; `"tdm-reservation": 1`; `prohibited-purposes` includes `training-of-machine-learning-models`; `last-reviewed` within 90 days | **PASS** | |
| 6 | `/llms.txt` | Present; covers free-core paths only | **PASS** | |

**Test 2 status:** **PASS** as of 2026-05-19 on Netlify deploy.

---

## Bonus — Bot Mgmt analytics (once Cloudflare Bot Mgmt enabled)

| # | Action | Result |
|---|---|---|
| 7 | Cloudflare Bot Analytics last 7 days — GPTBot blocked, ChatGPT-User allowed on free | **N/A** — Cloudflare Bot Mgmt not yet enabled (Netlify-hosted today; planned move when canonical domain ships) |
| 8 | `Path = /paid/*` last 7 days — all AI crawlers blocked, auth-required hits 401/403 | **N/A** — no paid paths exist yet |

---

## Findings + actions

| Finding | Action |
|---|---|
| Canonical domain `attest-ai.com` not yet registered → sitemap + JSON-LD URLs point at a non-resolving domain | Register domain + DNS → Netlify. Until then, Netlify deploy serves; URLs in metadata are aspirational. |
| Test 1 cannot run until Google + Bing index the live deploy | Re-run Test 1 four weeks after Cloudflare DNS resolves on canonical domain |
| Test 2 passes on Netlify deploy → robots + TDMRep + llms files all correctly published | None; pass through to next quarter |
| Page-level `X-Robots-Tag` header on paid paths now active via Netlify `_headers` file | Verify via `curl -I https://aisafework.netlify.app/pricing.html` — should show `X-Robots-Tag: noai, noimageai, nosnippet, noindex, nofollow` |
| Cloudflare Bot Management not yet active | Plan: move from Netlify to Cloudflare Pages OR proxy Netlify behind Cloudflare when canonical domain provisioned |

---

## Next review

**Q4 2026** — scheduled first week of November 2026. Pre-conditions:

- Canonical domain `attest-ai.com` live + Cloudflare-fronted
- Cloudflare Bot Management enabled (test #7 + #8 should then pass)
- 4+ weeks since Google / Bing indexed (Test 1 should then pass)

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Owner | Founder | 2026-05-19 |
