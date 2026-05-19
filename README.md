# AI Safe@Work

A 12-module practical course on protecting yourself and the business when
using AI tools at work. Aimed at non-technical SMB employees.
References ISO/IEC 42001:2023, ISO/IEC 27001:2022, GDPR, and the
EU AI Act (Regulation 2024/1689) as guidance — but in plain English.

## What's here

Static HTML site. No build step, no dependencies. Open `index.html` in a
browser or serve the directory with any static file server.

```
ai-safe-at-work/
├── index.html         # Landing / gate page
├── course.html        # Overview with all 12 module cards
├── module-1.html      # Why this course exists
├── module-2.html      # What AI tools do with what you type
├── module-3.html      # The never-paste list
├── module-4.html      # Picking the right tool for the job
├── module-5.html      # Verifying what the AI tells you
├── module-6.html      # AI-powered scams aimed at you
├── module-7.html      # Bias, fairness, and not embarrassing the business
├── module-8.html      # Copyright, IP, and other people's content
├── module-9.html      # Logging, accountability, "who used what"
├── module-10.html     # When something goes wrong
├── module-11.html     # The 60-second pre-submit checklist (printable)
├── module-12.html     # The standards behind this course
├── privacy.html       # Privacy notice (we collect nothing)
├── terms.html         # Terms (general guidance, not legal advice)
└── assets/
    └── style.css      # Shared design system
```

## Running locally

Any static server. Example with Python:

```
cd ai-safe-at-work
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying

The site is self-contained static HTML. Drop the directory onto any
static host (Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront, a
USB stick on an internal kiosk — anything that serves files).

## What this course is

A practical reading-only course for ordinary SMB staff who use ChatGPT,
Copilot, Claude, Gemini, or any other AI tool day-to-day. Twelve modules,
about 90 minutes end-to-end, plus a one-page printable checklist
(`module-11.html`).

## What this course isn't

* Not legal advice. Standards summaries are plain-English orientation, not
  a substitute for advice on a specific situation.
* Not a certification course. Doesn't qualify anyone to audit anything.
* Not a tooling recommendation. Doesn't say which AI to use — that's a
  business decision.
* Not a moving target. The text is grounded in regulations and standards
  in force in 2026. Re-check primary sources before acting on specific
  articles or thresholds.

## Audience

* Solo operators and SMB staff using AI at work
* HR, legal, ops, sales, marketing, finance — anyone non-engineering
* Newly-onboarded staff at companies starting to take AI governance
  seriously
* Anyone whose manager has said "we need to do something about AI risk"
  and isn't sure what
