# Sub-processor register

> Every third party that processes personal data on our behalf, or that operationally we depend on for the business. **Reviewed quarterly.**

| Vendor | Service | Personal data touched | Entity & location | DPA in place? | Last reviewed | Notes |
|---|---|---|---|---|---|---|
| Cloudflare Pages (or Netlify — TBD) | Static hosting + CDN | Server-log level IP + UA (per default retention 30d, configurable) | Cloudflare, US — EU regions selectable | Standard DPA + SCCs available | 2026-05-19 | Decision pending; both meet bar |
| Google Fonts | Font CSS delivery | IP at request time, no further processing per Google policy | Google LLC, US | Google standard data processing terms | 2026-05-19 | Consider self-hosting fonts to remove this dependency |
| Anthropic | Claude API + claude.ai for content drafting | Drafts may contain public-figure names; no customer data | Anthropic, US — EU region available on Enterprise | Commercial Terms + DPA on paid tiers | 2026-05-19 | Training opt-out confirmed |
| OpenAI | ChatGPT for content drafting | Same as Anthropic | OpenAI, US — EU region on Enterprise | API Data Processing Addendum on paid tiers | 2026-05-19 | Training opt-out confirmed at workspace level |
| Anysphere | Cursor IDE for development | Code + any text we type into the editor | Anysphere, US | Privacy mode setting reviewed | 2026-05-19 | Privacy mode enabled — no codebase indexing |
| GitHub | Repo hosting + CI | Source code (no PII); commit-author metadata | GitHub, Microsoft, US | Microsoft / GitHub DPA | 2026-05-19 | Public repo planned; private fork for `.audit/` |
| Domain registrar | Domain registration for attest-ai.com | Registrant contact (using founder details) | TBD | Standard registrar terms | TBD | Provider TBD; pick one with WHOIS privacy |
| Email provider | Inbound + outbound email | Email contents + addresses | TBD (likely Fastmail / Proton / ProtonMail Business) | EU-based providers preferred | TBD | Decision before going commercial |
| Stripe (planned) | Payment processing | Customer email, billing address, payment card (tokenised) | Stripe, Ireland (EU) / US | Stripe DPA + SCCs | n/a yet | When commercial offering live |

## Change-notification protocol

- If a sub-processor materially changes terms, sub-processors, or training behaviour: review same week, document in `decision-log.md` (parent dir).
- If a new sub-processor is added: must appear here BEFORE first use.

## Sub-processor exit register

| Vendor | Exited | Reason |
|---|---|---|
| _(none yet)_ | | |
