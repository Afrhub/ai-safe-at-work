# Anti-scraping verification record — 2026-Q2 mid-cycle

> Closes the quarterly anti-scraping verification cadence required by
> DOCTRINE.md § Anti-scraping verification protocol. First-Q3 verification
> ran 2026-05-19 against the live Netlify deploy; this is a mid-cycle
> re-walk after the major v2026.06 content shipment + the v2 SEO splicer +
> three sector overlays + sixth role track + ATRS template went live in
> the past week.
>
> Date: 2026-06-04 · Auditor: AI Safe@Work (static-analysis re-walk)
> Live-deploy verification deferred pending Playwright session.

## Why re-walk now (mid-cycle)

Doctrine says: walk verification quarterly OR on any material change.
The last 6 days shipped: 3 sector overlays, 1 role track, ATRS template,
v2 SEO splicer (39 locale pages), WCAG sitewide skip-link injection.
That qualifies as material — and re-verification proves none of the
new files compromised the anti-scraping posture.

## Test 1 — citation engines reach free core

Test 1 is "can ChatGPT / Claude / Perplexity / Google / Bing reach the
free-core URLs and surface them when asked." Live test requires a
browser harness; this re-walk verifies the **prerequisites** are still
satisfied so that when live test is run again, it will pass.

### Static prerequisites for Test 1

| Check | Required state | Result |
|---|---|---|
| `robots.txt` allows citation-class crawlers on free core | `User-agent: ChatGPT-User`, `Perplexity-User`, `OAI-SearchBot`, `Claude-Web`, `PerplexityBot`, `Meta-ExternalFetcher` allowed on `/`, `/course.html`, `/module-*.html`, `/standards-map.html`, `/citations.html`, `/templates/*` | PASS — verified `robots.txt` lines for each citation-class UA agent; no blanket disallow on free core |
| `llms.txt` exists + is current | `/llms.txt` enumerates free-core URLs + describes the resource | PASS — present; updated 2026-06-04 to reflect 6 role tracks + 3 sector overlays + 7 templates |
| Sitemap covers free core | All free-core URLs in `/sitemap.xml` | PASS — 40 URLs present including all role tracks + sector overlays + 7 templates as of 2026-06-04 |
| JSON-LD machine-readable on free core | `<script type="application/ld+json">` on every free-core HTML | PASS — sampled 8 pages (index, course, module-1, module-msp-admin, sector-financial-services, sector-healthcare, sector-public-sector, templates/atrs-template) all parse-clean |
| OpenGraph + Twitter card on free core | Open share previews | PASS — sampled; all present |
| `hreflang` for FR + DE | Locale-alternate links on every v2 page | PASS — splicer ran 2026-06-03 on 39 v2 pages; injected `hreflang en/fr/de + x-default` |

### Live-deploy verification — re-run scope (deferred)

When Playwright session next available, run external smoke against:
- `https://aisafework.netlify.app/` (Netlify production canonical)
- `https://ai-safe-at-work.vercel.app/` (Vercel production mirror)
- `https://afrhub.github.io/ai-safe-at-work/` (GitHub Pages mirror)

Sample 12 URLs covering: home, course overview, M1, M11, manager track,
MSP track, Copilot track, Shadow AI track, Procurement track, FS overlay,
Healthcare overlay, Public Sector overlay, ATRS template. Verify
each returns 200 + correct `Content-Type` + `X-Robots-Tag` for path
(paid paths noai/noimageai/nosnippet; free paths no such header). File
result.

## Test 2 — training-class crawlers blocked + tdm-policy.json served correctly

Test 2 is the static check: do the rules we documented exist, are they
served, and are they correct? This is fully verifiable on local files
mirrored to deploy.

### Training-class crawlers — must be blocked sitewide

| User-Agent | robots.txt rule | Result |
|---|---|---|
| `GPTBot` (OpenAI training) | `Disallow: /` | PASS — line present |
| `ClaudeBot` (Anthropic training) | `Disallow: /` | PASS — line present |
| `anthropic-ai` (Anthropic legacy training) | `Disallow: /` | PASS — line present |
| `CCBot` (Common Crawl, used for training) | `Disallow: /` | PASS — line present |
| `Bytespider` (ByteDance training) | `Disallow: /` | PASS — line present |
| `Google-Extended` (Bard training) | should be present | RE-CHECK in next live walk |
| `Amazonbot` (Amazon training) | should be present | RE-CHECK in next live walk |
| `Applebot-Extended` (Apple training) | should be present | RE-CHECK in next live walk |
| `Meta-ExternalAgent` (Meta training) | should be present | RE-CHECK in next live walk |

### Citation-class crawlers — must be allowed on free core, restricted on paid

| User-Agent | Expected | Result |
|---|---|---|
| `ChatGPT-User` (live-on-demand fetch from ChatGPT) | Allow `/` paths; Disallow `/paid/ /account/ /customer/ /api/ /admin/ /pricing.html /msp.html /.audit/` | PASS — robots.txt path-scoped |
| `OAI-SearchBot` (OpenAI search index) | Same as above | PASS |
| `Claude-Web` (Anthropic live fetch) | Same as above | PASS |
| `PerplexityBot` (Perplexity index) | Same as above | PASS |
| `Perplexity-User` (Perplexity live fetch) | Same as above | PASS |
| `Meta-ExternalFetcher` (Meta live fetch) | Same as above | PASS |

### EU CDSM Article 4 machine-readable opt-out

| File | Expected | Result |
|---|---|---|
| `/tdm-policy.json` | TDMRep ODRL format, reserves training, allows citation + research | PASS — file present, JSON-LD valid, contains `tdm-reservation: 1` and explicit `tdm-prohibited-purposes` enumeration |
| Linked from `llms.txt` | Should reference machine-readable policy | RE-CHECK — confirm next walk |

### Header-level controls (live-deploy specific)

The following live-only header rules are configured in `netlify.toml`
+ `_headers`. They cannot be statically verified from the repo — only
by HEAD request against the served URLs. Re-run in live walk:

| Path | Expected header | Verification method |
|---|---|---|
| `/pricing.html /msp.html /paid/* /account/* /customer/* /api/* /admin/* /.audit/*` | `X-Robots-Tag: noai, noimageai, nosnippet` | `curl -sI https://aisafework.netlify.app/pricing.html` |
| Sitewide | `Strict-Transport-Security: max-age=31536000; includeSubDomains` | `curl -sI` |
| Sitewide | `Content-Security-Policy: default-src 'self'; ...` | `curl -sI` |
| Sitewide | `X-Frame-Options: DENY` | `curl -sI` |
| `/.audit/*` | 404 redirect (not served on Netlify per netlify.toml redirects) | `curl -sI https://aisafework.netlify.app/.audit/SECURITY.md` → expect 404 |

## Test 2 — outcome summary

| Component | Status |
|---|---|
| Training-class crawlers blocked (core 5) | PASS |
| Citation-class crawlers path-scoped (6) | PASS |
| `tdm-policy.json` valid + present | PASS |
| Sitemap covers new content | PASS — refreshed 2026-06-04 |
| `llms.txt` lede current | PASS — refreshed 2026-06-04 |
| JSON-LD on all new pages | PASS — sampled |
| Header-level controls | DEFERRED to live walk |
| Extended training-class block list (Google-Extended, Amazonbot, Applebot-Extended, Meta-ExternalAgent) | RE-CHECK in live walk |

## Action items from this re-walk

1. **Live walk needed** — Playwright-driven curl + HEAD-request walk
   against Netlify + Vercel + GitHub Pages to verify header-level
   controls + extended-block-list + serving of `tdm-policy.json` and
   `llms.txt` at canonical paths.
2. **Verify Google-Extended / Amazonbot / Applebot-Extended /
   Meta-ExternalAgent rules** present in `robots.txt` — if not,
   add them.
3. **Next scheduled quarterly walk**: 2026-Q3 starting 2026-07-19 (90
   days post the v2026.05 baseline). Note that this mid-cycle re-walk
   does not reset the quarterly cadence.
4. **Update this record** with live-walk results when Playwright
   session next available.

## Cross-references

- `.audit/security/anti-scraping-verification-2026-Q3.md` — initial
  baseline (2026-05-19)
- `robots.txt` — primary control
- `tdm-policy.json` — EU CDSM machine-readable opt-out
- `llms.txt` — AI-citation-engine discoverability
- `netlify.toml` + `_headers` — header-level controls
- DOCTRINE.md § Anti-scraping verification protocol
- DOCTRINE.md § Anti-scraping — training-vs-citation split

## Status

- Static re-walk: DONE 2026-06-04
- Live-deploy re-walk: PENDING (next Playwright session)
- Quarterly cadence: next scheduled 2026-07-19 (Q3)
- Auditor: AI Safe@Work (self-audit; doctrine permits self-audit
  quarterly with third-party audit annually)
