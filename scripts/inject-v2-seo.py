#!/usr/bin/env python3
"""Inject SEO + AEO metadata block into v2 HTML pages.

Idempotent: detects marker `<!-- v2-seo:injected vN -->` and replaces the
existing block on re-run. Use --dry-run to preview.

Injects, just before `</head>`:
  - <link rel="canonical">
  - hreflang triples (en, fr, de, x-default)
  - OpenGraph meta
  - Twitter card meta
  - JSON-LD (WebSite / Course / LearningResource + BreadcrumbList)

Procurement-grade fields:
  - JSON-LD `Course.provider` populated (schema.org validator requires it)
  - JSON-LD `inLanguage` matches actual HTML lang
  - hreflang uses BCP-47 codes
  - Canonical URL is absolute https://

Author: gate 13 + 14 splicer (DOCTRINE.md procurement-gate table)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V2 = ROOT / "v2"
MANIFEST = V2 / "modules.json"

# Canonical base — current production deploy per DOCTRINE.md § 903.
# When gate 12 (custom domain) lands, change this constant.
BASE = "https://aisafework.netlify.app"

# Banner that marks block. Bump when block schema changes so re-runs replace.
MARKER_BEGIN = "<!-- v2-seo:injected v1 BEGIN -->"
MARKER_END = "<!-- v2-seo:injected v1 END -->"
MARKER_RE = re.compile(
    re.escape(MARKER_BEGIN) + r".*?" + re.escape(MARKER_END) + r"\n?",
    re.DOTALL,
)

OG_IMAGE = "/og-card.png"  # v1 root image, served from origin
SITE_NAME_EN = "AI Safe@Work"
SITE_NAME_FR = "AI Safe@Work"
SITE_NAME_DE = "AI Safe@Work"

LOCALE_TAG = {"en": "en_GB", "fr": "fr_FR", "de": "de_DE"}
HREF_TAG = {"en": "en", "fr": "fr", "de": "de"}


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def locale_for_path(p: Path) -> str:
    parts = p.relative_to(V2).parts
    if parts[0] in ("fr", "de"):
        return parts[0]
    return "en"


def page_type(p: Path) -> str:
    name = p.name
    if name == "index.html":
        return "landing"
    if name == "course.html":
        return "course"
    m = re.match(r"module-(\d+)\.html$", name)
    if m:
        return "module"
    return "other"


def module_id(p: Path) -> int | None:
    m = re.match(r"module-(\d+)\.html$", p.name)
    return int(m.group(1)) if m else None


def relative_url(p: Path) -> str:
    """Return absolute URL for this page given current BASE."""
    rel = "/" + p.relative_to(ROOT).as_posix()
    return BASE + rel


def sibling_urls(p: Path) -> dict[str, str]:
    """Return {locale: absolute_url} for the en/fr/de sibling of this page."""
    rel = p.relative_to(V2).as_posix()
    if rel.startswith("fr/"):
        rel = rel[len("fr/"):]
    elif rel.startswith("de/"):
        rel = rel[len("de/"):]
    return {
        "en": f"{BASE}/v2/{rel}",
        "fr": f"{BASE}/v2/fr/{rel}",
        "de": f"{BASE}/v2/de/{rel}",
    }


def title_and_summary(p: Path, locale: str, manifest: dict) -> tuple[str, str]:
    pt = page_type(p)
    if pt == "landing":
        ui = {
            "en": ("AI Safe@Work — safe AI adoption, operational governance",
                   "Eleven-module governance-led course on safe AI adoption and operational risk. Mobile-first. Free."),
            "fr": ("AI Safe@Work — adoption sûre de l'IA, gouvernance opérationnelle",
                   "Cours en onze modules sur l'adoption sûre de l'IA et le risque opérationnel. Mobile d'abord. Gratuit."),
            "de": ("AI Safe@Work — sichere KI-Einführung, operative Governance",
                   "Elf-Modul-Kurs zur sicheren KI-Einführung und operativem Risiko. Mobile-first. Kostenlos."),
        }
        return ui[locale]
    if pt == "course":
        ui = {
            "en": ("All modules · AI Safe@Work",
                   "Eleven modules, around 90 minutes total. Read in order or jump in."),
            "fr": ("Tous les modules · AI Safe@Work",
                   "Onze modules, environ 90 minutes au total. Lire dans l'ordre ou sauter."),
            "de": ("Alle Module · AI Safe@Work",
                   "Elf Module, etwa 90 Minuten insgesamt. In Reihenfolge lesen oder springen."),
        }
        return ui[locale]
    if pt == "module":
        mid = module_id(p)
        for mod in manifest["modules"]:
            if mod["id"] == mid:
                if locale == "en":
                    return (
                        f"Module {mid:02d} · {mod['title']} — AI Safe@Work",
                        mod.get("summary", "")[:200],
                    )
                loc = mod.get("locales", {}).get(locale, {})
                t = loc.get("title", mod["title"])
                s = loc.get("summary", mod.get("summary", ""))[:200]
                return (f"Module {mid:02d} · {t} — AI Safe@Work", s)
    return ("AI Safe@Work", "AI safety course.")


def build_json_ld(p: Path, locale: str, manifest: dict, title: str, summary: str, canonical: str) -> list[dict]:
    pt = page_type(p)
    provider = {
        "@type": "Organization",
        "name": "AI Safe@Work",
        "url": BASE + "/",
    }
    breadcrumb_items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"}]
    breadcrumb_items.append({
        "@type": "ListItem", "position": 2,
        "name": {"en": "v2", "fr": "v2", "de": "v2"}[locale],
        "item": f"{BASE}/v2/" if locale == "en" else f"{BASE}/v2/{locale}/",
    })
    docs: list[dict] = []
    if pt == "landing":
        docs.append({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_NAME_EN,
            "url": canonical,
            "inLanguage": locale,
            "description": summary,
            "publisher": provider,
        })
    elif pt == "course":
        breadcrumb_items.append({
            "@type": "ListItem", "position": 3,
            "name": {"en": "All modules", "fr": "Tous les modules", "de": "Alle Module"}[locale],
            "item": canonical,
        })
        docs.append({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": title.split(" — ")[0],
            "description": summary,
            "url": canonical,
            "inLanguage": locale,
            "provider": provider,
            "isAccessibleForFree": True,
            "educationalLevel": "Beginner",
            "audience": {"@type": "EducationalAudience", "audienceType": "employee"},
            "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "courseWorkload": "PT90M",
                "inLanguage": locale,
            },
        })
    elif pt == "module":
        mid = module_id(p)
        breadcrumb_items.append({
            "@type": "ListItem", "position": 3,
            "name": title.split(" — ")[0],
            "item": canonical,
        })
        # Find duration from manifest for ISO 8601
        dur_minutes = 10
        for mod in manifest["modules"]:
            if mod["id"] == mid:
                d = mod.get("duration", "10 min")
                m = re.search(r"(\d+)", d)
                if m:
                    dur_minutes = int(m.group(1))
                break
        docs.append({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "name": title.split(" — ")[0],
            "description": summary,
            "url": canonical,
            "inLanguage": locale,
            "learningResourceType": "lesson",
            "educationalLevel": "Beginner",
            "timeRequired": f"PT{dur_minutes}M",
            "isPartOf": {
                "@type": "Course",
                "name": {"en": "AI Safe@Work — v2", "fr": "AI Safe@Work — v2", "de": "AI Safe@Work — v2"}[locale],
                "url": f"{BASE}/v2/" if locale == "en" else f"{BASE}/v2/{locale}/",
            },
            "provider": provider,
        })
    docs.append({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb_items,
    })
    return docs


def build_block(p: Path, manifest: dict) -> str:
    locale = locale_for_path(p)
    canonical = relative_url(p)
    siblings = sibling_urls(p)
    title, summary = title_and_summary(p, locale, manifest)
    og_locale = LOCALE_TAG[locale]
    og_alt = [LOCALE_TAG[k] for k in ("en", "fr", "de") if k != locale]
    jsonld = build_json_ld(p, locale, manifest, title, summary, canonical)

    parts: list[str] = [MARKER_BEGIN]
    parts.append(f'<link rel="canonical" href="{canonical}" />')
    for loc, tag in HREF_TAG.items():
        parts.append(f'<link rel="alternate" hreflang="{tag}" href="{siblings[loc]}" />')
    parts.append(f'<link rel="alternate" hreflang="x-default" href="{siblings["en"]}" />')
    # OG
    parts.append(f'<meta property="og:title" content="{html_escape(title)}" />')
    parts.append(f'<meta property="og:description" content="{html_escape(summary)}" />')
    parts.append(f'<meta property="og:type" content="{"article" if page_type(p) == "module" else "website"}" />')
    parts.append(f'<meta property="og:url" content="{canonical}" />')
    parts.append(f'<meta property="og:image" content="{BASE}{OG_IMAGE}" />')
    parts.append(f'<meta property="og:site_name" content="{SITE_NAME_EN}" />')
    parts.append(f'<meta property="og:locale" content="{og_locale}" />')
    for alt in og_alt:
        parts.append(f'<meta property="og:locale:alternate" content="{alt}" />')
    # Twitter
    parts.append('<meta name="twitter:card" content="summary_large_image" />')
    parts.append(f'<meta name="twitter:title" content="{html_escape(title)}" />')
    parts.append(f'<meta name="twitter:description" content="{html_escape(summary)}" />')
    parts.append(f'<meta name="twitter:image" content="{BASE}{OG_IMAGE}" />')
    # JSON-LD
    for doc in jsonld:
        parts.append('<script type="application/ld+json">')
        parts.append(json.dumps(doc, ensure_ascii=False, separators=(",", ":")))
        parts.append("</script>")
    parts.append(MARKER_END)
    return "\n".join(parts) + "\n"


def html_escape(s: str) -> str:
    return (s.replace("&", "&amp;").replace('"', "&quot;")
              .replace("<", "&lt;").replace(">", "&gt;"))


def inject(p: Path, manifest: dict, dry: bool) -> str:
    text = p.read_text(encoding="utf-8")
    block = build_block(p, manifest)
    if MARKER_RE.search(text):
        new = MARKER_RE.sub(block, text)
        op = "replace"
    elif "</head>" in text:
        new = text.replace("</head>", block + "</head>", 1)
        op = "insert"
    else:
        return "no-head"
    if new == text:
        return "noop"
    if not dry:
        p.write_text(new, encoding="utf-8")
    return op


def discover() -> list[Path]:
    files: list[Path] = []
    for sub in ("", "fr/", "de/"):
        base = V2 / sub if sub else V2
        for name in ("index.html", "course.html"):
            f = base / name
            if f.exists():
                files.append(f)
        for i in range(1, 12):
            f = base / f"module-{i}.html"
            if f.exists():
                files.append(f)
    return files


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    manifest = load_manifest()
    files = discover()
    summary: dict[str, int] = {"insert": 0, "replace": 0, "noop": 0, "no-head": 0}
    for p in files:
        op = inject(p, manifest, args.dry_run)
        summary[op] = summary.get(op, 0) + 1
        print(f"  {op:8s}  {p.relative_to(ROOT).as_posix()}")
    print(f"\nfiles processed: {len(files)} — {summary}")
    if args.dry_run:
        print("\n(dry-run — no files written)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
