# Asset register

> **Owner:** Founder · **Effective:** 2026-05-19 · **Review:** quarterly · **Reg basis:** ISO/IEC 27001 A.5.9 (inventory of information and other associated assets)

## Information assets

| ID | Asset | Type | Classification | Owner | Location | Backup |
|---|---|---|---|---|---|---|
| I-01 | AI Safe@Work course source code | source repo | Public | Founder | `~/.openclaw/workspace/ai-safe-at-work/` + GitHub (planned) | git remote |
| I-02 | Doctrine + audit pack | docs | Internal | Founder | repo + agentic-os vault + second-brain vault | three locations |
| I-03 | Published course site | live web | Public | Founder | hosting provider (TBD prod) | rebuildable from repo |
| I-04 | Email correspondence with readers (future) | comms | Internal | Founder | email provider | provider-managed |
| I-05 | Financial records (future) | regulated | Confidential | Founder | bookkeeping system | provider + local |
| I-06 | Customer account data (future) | regulated | Confidential | Founder | payment provider + own records | provider + local |

## Software assets

| ID | Asset | Owner | Renewal | Notes |
|---|---|---|---|---|
| S-01 | Anthropic Claude (paid) | Founder | monthly | AI authoring |
| S-02 | OpenAI ChatGPT (paid) | Founder | monthly | AI authoring backup |
| S-03 | Cursor (paid) | Founder | monthly | IDE |
| S-04 | GitHub | Founder | monthly | repo + actions |
| S-05 | Cloudflare / Netlify (TBD) | Founder | monthly | hosting |
| S-06 | Domain registrar (TBD) | Founder | annual | aisafeatwork.org |
| S-07 | Password manager (1Password / Bitwarden — TBD) | Founder | annual | secrets |
| S-08 | Email provider (TBD) | Founder | annual | contact / business email |
| S-09 | Stripe (planned) | Founder | n/a | payments when live |
| S-10 | Bookkeeping (planned) | Founder | annual | accounts |
| S-11 | Insurance (planned) | Founder | annual | PI + cyber |

## Hardware assets

| ID | Asset | Owner | Encryption | MFA | Notes |
|---|---|---|---|---|---|
| H-01 | Windows workstation | Founder | BitLocker | OS sign-in + Hello | Primary dev machine |
| H-02 | Backup external drive (future) | Founder | hardware-encrypted | — | Off-site backups |
| H-03 | Phone | Founder | OS-level | passkey + biometric | MFA receiver; password-manager unlock |

## Classification

- **Public:** ok to publish externally without restriction.
- **Internal:** business operational; not for external sharing without consideration.
- **Confidential:** restricted to founder; would cause harm if disclosed.
- **Regulated:** governed by GDPR / tax / similar; specific handling rules apply.

## Lifecycle

- **Onboarding** of a new asset: added to this register BEFORE use.
- **Renewal** of paid software: reviewed at renewal — still needed? Cheaper alternative? Better DPA?
- **Decommissioning**: marked `decommissioned YYYY-MM-DD`, NOT deleted from this register.
