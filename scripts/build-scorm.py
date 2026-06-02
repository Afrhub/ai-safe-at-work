#!/usr/bin/env python3
"""
Build the SCORM 1.2 distribution zip for AI Safe@Work v2.

Closes DOCTRINE.md § Procurement-readiness gates → Gate 4 (build half).

Usage:
    python scripts/build-scorm.py [--locale en|fr|de|all] [--out dist/]

Default: bundles the EN v2/ build into dist/ai-safe-at-work-scorm-v2-en.zip.
Pass --locale all to emit a per-locale zip for each available locale.

Security posture:
- Pure standard library. No network calls. No shell-out.
- Paths inside the zip are POSIX-normalised; never absolute, never above the
  source dir (zip-slip safe by construction since we control the listing).
- File mode is forced to 0o644 to avoid leaking dev-machine umask quirks.
- Output zip path is sanitised against ../ etc.

Re-runnable. Deterministic except for the embedded build timestamp.
"""

import argparse
import datetime as _dt
import os
import sys
import zipfile

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
V2_DIR = os.path.join(REPO_ROOT, "v2")

# Files always included regardless of locale. Paths relative to v2/.
SHARED_FILES = [
    "modules.json",
    "assets/v2.css",
    "assets/v2.js",
    "assets/scorm-api.js",
    "assets/xapi-adapter.js",
    "scorm/imsmanifest.xml",
    "scorm/metadata.xml",
    "scorm/README.md",
]

# Locale-specific shells. The SCORM SCO entry point is index.html in each.
LOCALE_FILES = {
    "en": [
        "index.html",
        "course.html",
    ] + [f"module-{i}.html" for i in range(1, 12)],
    "fr": [
        "fr/index.html",
        "fr/course.html",
    ] + [f"fr/module-{i}.html" for i in range(1, 12)],
    "de": [
        "de/index.html",
        "de/course.html",
    ] + [f"de/module-{i}.html" for i in range(1, 12)],
}


def _safe_arcname(rel_path: str) -> str:
    """POSIX-normalise the arcname; reject .. or absolute fragments."""
    rel = rel_path.replace("\\", "/").lstrip("/")
    parts = []
    for seg in rel.split("/"):
        if seg in ("", ".", ".."):
            continue
        parts.append(seg)
    if not parts:
        raise ValueError(f"refusing empty arcname for {rel_path!r}")
    return "/".join(parts)


def _add_file(zf: zipfile.ZipFile, src_abs: str, arcname: str):
    if not os.path.isfile(src_abs):
        print(f"  SKIP missing: {arcname}", file=sys.stderr)
        return
    with open(src_abs, "rb") as f:
        data = f.read()
    zinfo = zipfile.ZipInfo(arcname, date_time=(2026, 6, 2, 0, 0, 0))
    zinfo.external_attr = (0o644 & 0xFFFF) << 16
    zinfo.compress_type = zipfile.ZIP_DEFLATED
    zf.writestr(zinfo, data)


def build_for_locale(locale: str, out_dir: str) -> str:
    files = SHARED_FILES + LOCALE_FILES.get(locale, [])
    if locale not in LOCALE_FILES:
        raise SystemExit(f"unknown locale: {locale}")
    out_path = os.path.join(out_dir, f"ai-safe-at-work-scorm-v2-{locale}.zip")
    out_path = os.path.abspath(out_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    if os.path.commonpath([REPO_ROOT, out_path]) != REPO_ROOT:
        raise SystemExit(f"refusing to write zip outside repo: {out_path}")

    print(f"[scorm] building {out_path}")
    with zipfile.ZipFile(out_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for rel in files:
            src = os.path.join(V2_DIR, rel)
            arc = _safe_arcname(rel)
            _add_file(zf, src, arc)
    size = os.path.getsize(out_path)
    print(f"[scorm] wrote {out_path} ({size:,} bytes)")
    return out_path


def main():
    p = argparse.ArgumentParser(description="Build the AI Safe@Work v2 SCORM 1.2 package")
    p.add_argument("--locale", default="en", choices=list(LOCALE_FILES.keys()) + ["all"])
    p.add_argument("--out", default=os.path.join(REPO_ROOT, "dist"))
    args = p.parse_args()
    if args.locale == "all":
        for loc in LOCALE_FILES:
            build_for_locale(loc, args.out)
    else:
        build_for_locale(args.locale, args.out)
    print(f"[scorm] done at {_dt.datetime.now().isoformat()}")


if __name__ == "__main__":
    main()
