# Domain procurement evidence — 2026-06-03

> Closes DOCTRINE.md procurement-gate 12 ("HTTPS + production domain"). User
> action required to complete: purchase + DNS configuration. This file is the
> evidence record for the availability scan + the DNS recipe to use on purchase.

## Scope

DOCTRINE.md hard-codes `aisafeatwork.org` as the canonical production domain.
`xAPI` IRI namespaces (`.audit/integrations/xapi-statements-spec.md`) and the
v1 JSON-LD inject script (`.audit/inject-jsonld.py`) already reference it.

Current production canonical (per § 903) is the Netlify free subdomain
`aisafework.netlify.app`. Vercel also serves the same commit at
`ai-safe-at-work.vercel.app`. Custom domain not attached on either.

## Availability scan — RDAP

| Domain | RDAP code | Inference | Note |
|---|---|---|---|
| `aisafeatwork.org` | 302 → empty body | likely available | RDAP indirection at PIR did not return a record on follow |
| `aisafeatwork.com` | 302 → empty | ambiguous — re-check via WHOIS | |
| `aisafeatwork.net` | 302 → empty | ambiguous — re-check via WHOIS | |
| `aisafeatwork.io` | 404 | **AVAILABLE** | premium TLD |
| `aisafeatwork.eu` | 404 | **AVAILABLE** | EU-presence required |
| `aisafework.com` | **registered 2026-02-09** | TAKEN | registrar Whois Corp.; possibly defensive squat after our public-GitHub launch |
| `aisafework.io` | 404 | available | |
| `aisafework.eu` | 404 | available | EU-presence required |

**Squatter signal**: `aisafework.com` registered ~2026-02-09, three months after
this project went public. Could be coincidence, could be opportunistic. Does
not block us — doctrine targets `.org` not `.com`. Note in case it surfaces
in cease-and-desist or trademark territory later.

## Recommendation

Buy `aisafeatwork.org` as primary + `aisafeatwork.eu` as defensive secondary.

Skip `.com` variants — squatter on `aisafework.com` reduces value of the
`-at-` variant; doctrine is `.org` first regardless.

`.io` skipped — premium pricing, not aligned with non-profit-feeling brand.

## Where to buy

Recommended: **Cloudflare Registrar** (wholesale-only pricing, no upsells,
no privacy-fee tricks). Alternative: **Porkbun** (similar posture, good UI).

Avoid GoDaddy (markup + upsell barrage), Namecheap (good but not as cheap as
Cloudflare), retail registrars in general.

## DNS recipe — single-host (recommended)

Decide which host serves prod. Current state: both Vercel + Netlify deploy
on push. Pick ONE as canonical to avoid duplicate-content + SEO split.

### Option A — point at Vercel (recommended for v2 procurement)

1. Buy `aisafeatwork.org` at Cloudflare Registrar.
2. In Vercel project settings → Domains → add `aisafeatwork.org` + `www.aisafeatwork.org`.
3. Vercel will display the exact DNS records to create. Typically:

```
TYPE  NAME              VALUE                       TTL
A     @                 76.76.21.21                 3600
CNAME www               cname.vercel-dns.com        3600
```

4. Set them in Cloudflare DNS panel. Disable Cloudflare proxy (orange-cloud OFF)
   on these records — Vercel handles TLS + edge already; double-CDN causes loops.
5. Wait for Vercel "Valid Configuration". TLS provisions automatically (Let's Encrypt).
6. In Vercel project settings → Domains → set `aisafeatwork.org` as
   **primary** (`www` redirects to root).
7. Test: `curl -sI https://aisafeatwork.org/v2/` → expect 200.

### Option B — point at Netlify (if you prefer Netlify, e.g. for build hooks)

Substitute step 2/3 with:

```
TYPE   NAME    VALUE                                TTL
A      @       75.2.60.5                             3600
CNAME  www     <site-name>.netlify.app               3600
```

Netlify also has an `ALIAS` / `ANAME` flow if your DNS supports it
(Cloudflare does).

## Post-purchase tasks (when domain is live)

In this repo, after the domain resolves:

1. **Sed-swap base URLs** in injected SEO blocks:

```bash
git grep -l "aisafework.netlify.app" v2/ | xargs sed -i 's|https://aisafework.netlify.app|https://aisafeatwork.org|g'
```

2. **Re-run SEO splicer** if `BASE` constant in `scripts/inject-v2-seo.py`
   changes — the splicer is idempotent (`v2-seo:injected v1` marker) so
   re-running replaces the injected blocks cleanly:

```bash
# edit scripts/inject-v2-seo.py: BASE = "https://aisafeatwork.org"
python scripts/inject-v2-seo.py
```

3. **Update doctrine table row 12** to DONE with commit ref.
4. **Update `_headers` HSTS preload** — only after 30 days of clean TLS,
   submit to <https://hstspreload.org/>.
5. **Lift v2 `noindex` meta** if native-translation review (gate 5 follow-up)
   has completed — otherwise v2 stays soft-launched.
6. **Update sitemap.xml** to include v2 EN/FR/DE entries.
7. **Verification** — run anti-scraping Test 1/2 against new origin
   (`.audit/security/anti-scraping-verification-2026-Q3.md` template).

## Cost estimate

| Item | Annual | Notes |
|---|---|---|
| `aisafeatwork.org` at Cloudflare Registrar | ~£10 | wholesale |
| `aisafeatwork.eu` defensive | ~£8 | EU-presence may add small fee |
| Cloudflare DNS | £0 | free tier sufficient |
| Vercel hosting (current Hobby) | £0 | until paid surface ships |
| **Total** | **~£18/yr** | |

## Status

- Scan: **DONE 2026-06-03**
- Purchase: **PENDING USER ACTION** (financial transaction — not auto-executable)
- DNS config: **BLOCKED on purchase**
- Sed-swap canonical URLs in repo: **BLOCKED on DNS live**
- Doctrine gate 12 flip: **BLOCKED on TLS verified**

## Cross-references

- DOCTRINE.md row 12 (procurement-gate table)
- DOCTRINE.md § 903 (current canonical = Netlify subdomain)
- `.audit/integrations/xapi-statements-spec.md` (IRI namespace already on `.org`)
- `scripts/inject-v2-seo.py` constant `BASE` (sed target)
- `sitemap.xml` (locked to `aisafeatwork.org` — does not actually resolve until purchase + DNS live)
