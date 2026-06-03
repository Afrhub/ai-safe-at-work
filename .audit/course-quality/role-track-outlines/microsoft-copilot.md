# Role-track outline — Microsoft Copilot

> Scope-locking outline. Full content authored at Phase 2+ build slot.

## Audience

Staff at organisations that have deployed (or are deploying) Microsoft 365 Copilot, Copilot Studio, Copilot Pages, Copilot for Sales / Service / Finance, or any other Microsoft-branded Copilot. Primary persona: M365 admin or governance lead inside an SMB or mid-market. Secondary persona: end-user staff who use Copilot daily and need to understand what Copilot is doing on their behalf.

## Why a dedicated track

The universal modules cover AI governance generically. Microsoft Copilot has three properties that change the operational risk picture and warrant their own track:

1. **It surfaces data the user already had permission to see, but had forgotten about.** Misconfigured SharePoint inheritance + over-broad Microsoft 365 groups + a Copilot prompt = staff seeing salary spreadsheets, HR files, board minutes via summary outputs without any explicit "open this file" action.
2. **It is the default-on AI for hundreds of millions of staff.** Customers do not opt in; their IT admin opts them in. The literacy obligation lands hard.
3. **Its data-residency story is non-trivial.** Tenant region + Copilot extension boundaries + Azure OpenAI region + Bing grounding + non-grounding tenant settings interact. The DPO needs to know which lever controls which behaviour.

## Standards in scope

EU AI Act Articles 4, 14, 26, 50 · GDPR Articles 5, 6, 9, 22, 28, 32–34, 44–50 · ISO/IEC 42001 Clauses 6–9 + Annex A.4–A.10 · ISO/IEC 27001 Annex A.5.10, A.5.23, A.5.34, A.6.3, A.8.5, A.8.12, A.8.15 · Microsoft Service Trust Portal references · Microsoft Defender for Cloud Apps governance signals.

## Draft module list (10–12 modules)

1. What is Microsoft Copilot, exactly — Copilot vs Copilot Studio vs Copilot for X
2. The permissions inheritance problem — why Copilot surfaces files you forgot you had permission to see
3. Data residency — where your prompts and responses live (tenant / region / Bing grounding settings)
4. SharePoint sensitivity labels, Purview information protection, and how Copilot respects them
5. Copilot Studio — building governed agents (or accidentally exfiltrating data through one)
6. Microsoft 365 group hygiene — the upstream control for Copilot output safety
7. End-user prompt patterns — what to ask, what not to ask, what to verify
8. Audit logging in Microsoft 365 — what is captured, where, for how long
9. Defender for Cloud Apps — detecting risky Copilot usage patterns
10. Incident response for a Copilot data-exposure event
11. Cross-references to the universal course — when this track replaces vs supplements
12. Final assessment

## Target audience size (provisional)

- UK + EU SMB / mid-market with M365 Business or Enterprise: ~800k orgs.
- Of those, with active Copilot for M365 licences: ~25–35% by end-2026 (estimate).
- Reachable through MSPs: high — MSPs deliver M365 ops to most SMB customers.

## Sales motion

- MSPs deliver this track to their M365 customers as part of "Copilot rollout" engagements.
- Standard rev share applies (Awareness 70/30 to AI Safe@Work).
- Optional add-on: Microsoft Service Trust Portal-shaped procurement Q&A pack.

## Status

- 2026-06-02 — outline locked.
- 2026-06-03 — **SHIPPED** as `/module-copilot.html`. Single-page HTML, 12 sub-modules per outline, 10-question self-marked assessment, JSON-LD `LearningResource` + `BreadcrumbList`. Wired into `course.html` Role-tracks grid (now 4 cards), `llms.txt`, `sitemap.xml`. Fourth role track to ship; advances DOCTRINE.md gate 6 from 3/6 → 4/6.
