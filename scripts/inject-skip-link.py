#!/usr/bin/env python3
"""Inject WCAG 2.4.1 skip-to-content link + ensure <main id="main"> sitewide.

Idempotent. Marker `<!-- a11y:skip-link v1 -->` skips already-injected files.

For each HTML file:
  1. After the first `<body...>` opener, insert:
       <a class="skip-link" href="#main">Skip to main content</a>
  2. On the first `<main...>` element, ensure id="main" is present (preserving
     other attributes / classes).

Skips files with no <body> or no <main> (e.g. partials).

Author: gate 8 WCAG 2.2 AA first-pass audit (2026-06-03)
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Files we should NOT modify (build artefacts, audit pages we won't ship).
EXCLUDE_DIRS = {".git", "node_modules", "dist", ".audit"}
EXCLUDE_FILES: set[str] = set()

MARKER = "<!-- a11y:skip-link v1 -->"
SKIP_HTML = (
    '\n' + MARKER + '\n'
    '<a class="skip-link" href="#main">Skip to main content</a>\n'
)

BODY_OPEN = re.compile(r"(<body\b[^>]*>)", re.IGNORECASE)
MAIN_OPEN = re.compile(r"<main\b([^>]*)>", re.IGNORECASE)


def discover() -> list[Path]:
    out: list[Path] = []
    for p in ROOT.rglob("*.html"):
        if any(part in EXCLUDE_DIRS for part in p.relative_to(ROOT).parts):
            continue
        if p.name in EXCLUDE_FILES:
            continue
        out.append(p)
    return sorted(out)


def ensure_main_id(html: str) -> tuple[str, bool]:
    """Add id='main' to first <main> if missing. Return (html, changed)."""
    m = MAIN_OPEN.search(html)
    if not m:
        return html, False
    attrs = m.group(1)
    if re.search(r'\bid\s*=', attrs):
        return html, False  # already has id
    new = f'<main id="main"{attrs}>'
    return html[:m.start()] + new + html[m.end():], True


def inject(p: Path, dry: bool) -> str:
    text = p.read_text(encoding="utf-8")
    if MARKER in text:
        return "marker-present"
    body = BODY_OPEN.search(text)
    if not body:
        return "no-body"
    main = MAIN_OPEN.search(text, body.end())
    if not main:
        return "no-main"
    # Inject skip-link after <body...>
    new = text[:body.end()] + SKIP_HTML + text[body.end():]
    # Add id="main" if missing
    new, _ = ensure_main_id(new)
    if new == text:
        return "noop"
    if not dry:
        p.write_text(new, encoding="utf-8")
    return "injected"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    files = discover()
    summary: dict[str, int] = {}
    for p in files:
        op = inject(p, args.dry_run)
        summary[op] = summary.get(op, 0) + 1
        rel = p.relative_to(ROOT).as_posix()
        if op not in ("marker-present",):
            print(f"  {op:18s}  {rel}")
    print(f"\nfiles processed: {len(files)} — {summary}")
    if args.dry_run:
        print("(dry-run — no files written)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
