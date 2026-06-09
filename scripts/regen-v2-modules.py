#!/usr/bin/env python3
"""Regenerate v2/module-N.html bodies from the canonical spec source.

Reads .audit/course-quality/v2-content-source-2026-05-31.txt (founder's
locked spec for the v2 course refresh), splits it into 11 module blocks,
renders each block to v2-styled HTML and replaces the <main> body of
v2/module-N.html with the result. Preserves head, topbar, footer,
complete-button, skip-link injector marker, and all asset wiring.

Aligns each module body 1:1 with the spec so a procurement reviewer
reading the spec finds matching content on the page.

Marker: <!-- v2-module-body:regen v1 BEGIN --> ... <!-- v2-module-body:regen v1 END -->
inserted around the regenerated section so re-runs are idempotent.

Author: spec-alignment regenerator (DOCTRINE.md § Course content v2)
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPEC = ROOT / ".audit" / "course-quality" / "v2-content-source-2026-05-31.txt"
V2 = ROOT / "v2"

MARK_BEGIN = "<!-- v2-module-body:regen v1 BEGIN -->"
MARK_END = "<!-- v2-module-body:regen v1 END -->"


def html_escape(text: str) -> str:
    return (text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace('"', "&quot;"))


def inline(text: str) -> str:
    """Render inline markdown emphasis + quote-curly cleanup."""
    text = text.replace("—", "—").replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
    text = html_escape(text)
    # Bold then italic (order matters for nested)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
    return text


def split_modules(spec: str) -> list[list[str]]:
    """Split spec into 11 lists-of-lines, one per module."""
    lines = spec.splitlines()
    modules: list[list[str]] = [[] for _ in range(11)]
    idx = -1
    for ln in lines:
        m = re.match(r"^# MODULE (\d+)\s*$", ln)
        if m:
            idx = int(m.group(1)) - 1
            continue
        if idx >= 0:
            modules[idx].append(ln)
    return modules


# Per-module title fallbacks where spec doesn't include an H1 line after MODULE
# (M1 + M4 + M5 + M6 + M7 + M8 + M9 lack inline titles; others embed them)
MODULE_TITLES = {
    1: "Why AI Governance Matters",
    2: "What AI Tools Actually Do With What You Type",
    3: "The Never-Paste List",
    4: "Picking The Right Tool For The Job",
    5: "Verifying What The AI Tells You",
    6: "AI-Powered Scams Aimed At You",
    7: "Bias, Fairness, And Not Embarrassing The Business",
    8: "Logging, Accountability, And Auditability",
    9: "AI Incidents, Escalation, And What To Do When Something Goes Wrong",
   10: "The 60-Second AI Safety Checklist",
   11: "Final Assessment & AI Safe@Work Certification",
}
# Manual H1 styled fragments (preserve hand-curated accents from v2 launch)
# Each value is the full H1 inner HTML; trailing period applied automatically.
MODULE_H1_HTML = {
    1: 'Why AI <em>governance</em> matters',
    2: 'What AI tools <em>actually do</em> with what you type',
    3: 'The <em>never-paste</em> list',
    4: 'Picking the <em>right tool</em> for the job',
    5: 'Verifying what the <em>AI tells you</em>',
    6: 'AI-powered scams aimed at <em>you</em>',
    7: 'Bias, fairness, and not <em>embarrassing</em> the business',
    8: 'Logging, accountability, and <em>auditability</em>',
    9: 'AI incidents, escalation, and what to do when <em>something goes wrong</em>',
   10: 'The 60-second AI <em>safety checklist</em>',
   11: 'Final assessment & AI Safe@Work <em>certification</em>',
}

MODULE_DURATIONS = {
    1: "7–10 min",
    2: "8–12 min",
    3: "8–10 min",
    4: "8–12 min",
    5: "10–12 min",
    6: "10–12 min",
    7: "9–12 min",
    8: "8–10 min",
    9: "8–10 min",
   10: "5–7 min",
   11: "10–15 min · assessment",
}


def parse_module(lines: list[str], mod_id: int) -> dict:
    """Walk spec lines + extract structured dict.

    Returns:
        {
          'title': str,
          'duration': str,
          'outcomes': list[str],
          'sections': list[dict],   # each section: type + heading + body
        }
    """
    # Pre-process: collapse trailing blanks; track state machine
    out: dict = {
        "title": MODULE_TITLES[mod_id],
        "duration": MODULE_DURATIONS[mod_id],
        "outcomes": [],
        "sections": [],
    }

    # State
    mode = None  # 'outcomes' | 'section' | None
    cur: dict | None = None
    i = 0
    # Optional H1 line right after MODULE marker — used to confirm title
    while i < len(lines):
        ln = lines[i].rstrip()
        # Skip blank initial lines
        if not ln:
            i += 1
            continue
        m_h1 = re.match(r"^# (?!Introduction\b)(.+?)\s*$", ln)
        if m_h1 and out["title"] in m_h1.group(1):
            i += 1
            continue
        break

    while i < len(lines):
        ln = lines[i].rstrip()
        if not ln or ln == "---":
            i += 1
            continue

        # Duration marker
        if ln.startswith("### Duration"):
            i += 1
            # next non-blank line is the duration value
            while i < len(lines) and not lines[i].strip():
                i += 1
            if i < len(lines):
                out["duration"] = lines[i].strip()
                i += 1
            continue

        # Learning Outcome marker → list of outcomes
        if ln.startswith("### Learning Outcome"):
            i += 1
            mode = "outcomes"
            # skip lead-in prose like "By the end of this module, learners will:"
            while i < len(lines):
                nxt = lines[i].strip()
                if not nxt:
                    i += 1
                    continue
                if nxt.startswith("* "):
                    break
                # absorb (skip) lead-in prose
                i += 1
            continue

        # Section heading
        m_h = re.match(r"^# (.+?)\s*$", ln)
        if m_h:
            heading = m_h.group(1).strip()
            mode = "section"
            cur = {
                "type": classify_section(heading),
                "heading": heading,
                "items": [],   # list of (kind, payload) tuples
            }
            out["sections"].append(cur)
            i += 1
            continue

        # Inside section
        if mode == "section" and cur is not None:
            i = consume_into_section(lines, i, cur)
            continue

        # Inside outcomes
        if mode == "outcomes":
            if ln.startswith("* "):
                txt = ln[2:].rstrip(",").rstrip(".")
                # Strip 'and ' prefix conjoiners
                txt = re.sub(r"^and\s+", "", txt, flags=re.IGNORECASE)
                out["outcomes"].append(txt[0].upper() + txt[1:] if txt and txt[0].islower() else txt)
                i += 1
                continue
            # Outcomes ended — fall through but DO NOT consume current line
            mode = None
            # re-loop to handle this line as section / heading / etc.
            continue

        # Otherwise skip stray text
        i += 1

    return out


def classify_section(heading: str) -> str:
    h = heading.lower()
    if "introduction" in h:
        return "intro"
    if "knowledge check" in h:
        return "kc"
    if "key takeaways" in h:
        return "takeaways"
    if "practical workplace rule" in h:
        return "rule"
    if "practical exercise" in h:
        return "exercise"
    if "module completion outcome" in h:
        return "completion"
    if "scenario" in h and "based" not in h:
        return "scenario"
    if "red / amber / green" in h or "r/a/g" in h:
        return "rag"
    if "what you'll learn" in h or "what you will learn" in h:
        return "what-you-learn"
    if "the goal of this course" in h:
        return "goal"
    if heading.lower().startswith("question"):
        return "question"
    return "generic"


def consume_into_section(lines: list[str], i: int, cur: dict) -> int:
    """Read content lines belonging to current section until next # heading / ---."""
    buf_paragraph: list[str] = []
    buf_list: list[str] = []
    list_kind: str | None = None
    sub_state = {"h3": None, "h4": None}

    def flush_paragraph():
        nonlocal buf_paragraph
        if buf_paragraph:
            cur["items"].append(("p", " ".join(buf_paragraph).strip()))
            buf_paragraph = []

    def flush_list():
        nonlocal buf_list, list_kind
        if buf_list:
            cur["items"].append(("ul", list(buf_list)))
            buf_list = []
            list_kind = None

    while i < len(lines):
        ln = lines[i].rstrip()
        if not ln:
            flush_paragraph()
            flush_list()
            i += 1
            continue
        if ln == "---":
            flush_paragraph()
            flush_list()
            return i + 1
        m_h1 = re.match(r"^# (.+?)\s*$", ln)
        if m_h1:
            flush_paragraph()
            flush_list()
            return i  # caller picks up
        m_h2 = re.match(r"^## (.+?)\s*$", ln)
        if m_h2:
            flush_paragraph()
            flush_list()
            cur["items"].append(("h3", m_h2.group(1).strip()))
            i += 1
            continue
        m_h3 = re.match(r"^### (.+?)\s*$", ln)
        if m_h3:
            flush_paragraph()
            flush_list()
            cur["items"].append(("h4", m_h3.group(1).strip()))
            i += 1
            continue
        m_q = re.match(r"^> (.+)$", ln)
        if m_q:
            flush_paragraph()
            flush_list()
            cur["items"].append(("blockquote", m_q.group(1).strip()))
            i += 1
            continue
        if ln.startswith("* "):
            flush_paragraph()
            list_kind = "ul"
            txt = ln[2:].rstrip()
            # Trim trailing comma + final 'and ' joiner
            txt = txt.rstrip(",")
            txt = re.sub(r"^and\s+", "", txt, flags=re.IGNORECASE)
            buf_list.append(txt)
            i += 1
            continue
        # Plain prose line — flush any pending list first
        flush_list()
        # Strip trailing comma which spec sometimes uses
        buf_paragraph.append(ln.rstrip(","))
        i += 1

    flush_paragraph()
    flush_list()
    return i


# ─────────── Render ───────────

def render_module(mod: dict, mod_id: int, total: int) -> str:
    """Return the inner-main HTML body."""
    parts: list[str] = []
    parts.append(MARK_BEGIN)
    parts.append(f'  <p class="v2-eyebrow" data-mod-of-n>Module {mod_id:02d} of {total} · {html_escape(mod["duration"])}</p>')
    # Title from spec
    title = mod["title"]
    h1_html = MODULE_H1_HTML.get(mod_id) or stylise_h1(title)
    parts.append(f'  <h1 class="v2-h1">{h1_html}.</h1>')

    # Outcomes block
    if mod["outcomes"]:
        parts.append('  <div class="v2-objectives">')
        parts.append('    <div class="v2-objectives-title">By the end of this module you will</div>')
        parts.append("    <ul>")
        for o in mod["outcomes"]:
            parts.append(f"      <li>{inline(o)}</li>")
        parts.append("    </ul>")
        parts.append("  </div>")

    # Sections
    for s in mod["sections"]:
        parts.append("")
        parts.extend(render_section(s, mod_id))

    # Bottom nav (consistent shell)
    parts.append("")
    parts.append('  <section class="v2-bottom-nav" aria-label="Module navigation">')
    parts.append('    <div id="prev-mount"></div>')
    parts.append('    <button type="button" class="v2-complete-btn">Mark this module complete →</button>')
    parts.append('    <div id="next-mount"></div>')
    parts.append("  </section>")
    parts.append(MARK_END)
    return "\n".join(parts)


def stylise_h1(title: str) -> str:
    """Render H1 with one accented em segment for visual rhythm."""
    # Pick a noun phrase to accent. Crude heuristic: italicise last 1-3 words after the first comma or em-dash
    # else last 1 word.
    words = title.split()
    if len(words) < 3:
        return inline(title) + "."
    accent_idx = max(1, len(words) - 2)
    head = " ".join(words[:accent_idx])
    tail = " ".join(words[accent_idx:])
    tail = tail.rstrip(".")
    return f"{inline(head)} <em>{inline(tail)}</em>."


def render_section(s: dict, mod_id: int) -> list[str]:
    out: list[str] = []
    t = s["type"]
    head = s["heading"]
    items = s["items"]

    if t == "intro":
        # Intro = opening prose right after H1. Promote h3->h2 and h4->h3 so
        # the first section heading on the page is a real h2.
        for kind, payload in items:
            if kind == "h3":
                out.append(f"  <h2>{inline(payload)}</h2>")
            elif kind == "h4":
                out.append(f"  <h3>{inline(payload)}</h3>")
            else:
                out.extend(render_item(kind, payload))
        return out

    if t == "kc":
        # Knowledge check. Two authoring shapes appear in the spec:
        #   (a) list style — "## question" + "* option" bullets + "### Correct Answer" + answer text
        #       (e.g. "All of the above.")
        #   (b) lettered   — "## question" + "### A".."### D" headings each followed by the option
        #       text line, then "## Correct Answer" + a bare letter (A/B/C/D).
        # The original parser only handled (a); shape (b) silently dropped its options and answer.
        prompt = None
        list_options: list[str] = []
        lettered: list[tuple[str, str]] = []  # (letter, text), preserving spec order
        answer: str | None = None
        pending_letter: str | None = None
        answer_pending = False

        def _strip_quotes(s: str) -> str:
            return s.strip().strip("“”‘’\"'").strip()

        for kind, payload in items:
            text = payload if isinstance(payload, str) else ""
            low = text.lower().strip()
            if kind in ("h3", "h4"):
                if low.startswith("correct answer"):
                    answer_pending = True
                    pending_letter = None
                elif text.strip().upper() in ("A", "B", "C", "D", "E"):
                    pending_letter = text.strip().upper()
                elif prompt is None and kind == "h3":
                    prompt = text
                # any other heading inside the KC block is ignored
                continue
            if kind == "ul" and not list_options:
                list_options = payload
                continue
            if kind == "p":
                if answer_pending:
                    answer = text.strip()
                    answer_pending = False
                elif pending_letter is not None:
                    lettered.append((pending_letter, _strip_quotes(text)))
                    pending_letter = None
                # stray prose inside the KC block is ignored
                continue

        if lettered:
            letters: list[str] | None = [l for l, _ in lettered]
            options = [t for _, t in lettered]
        else:
            letters = None
            options = list_options

        # Expand a bare-letter answer ("C") to "C — <option text>" for clarity.
        answer_display = answer
        if answer and letters and len(answer.strip()) == 1 and answer.strip().upper() in letters:
            idx = letters.index(answer.strip().upper())
            answer_display = f"{answer.strip().upper()} — {options[idx]}"

        out.append('')
        out.append('  <div class="v2-kc">')
        out.append('    <div class="v2-kc-label">Quick knowledge check</div>')
        if prompt:
            out.append(f'    <div class="v2-kc-q">{inline(prompt)}</div>')
        if options:
            out.append("    <ol>")
            for o in options:
                out.append(f"      <li>{inline(o)}</li>")
            out.append("    </ol>")
        if answer_display:
            out.append('    <details class="v2-kc-answer"><summary>Show answer</summary>')
            out.append(f"    {inline(answer_display)}</details>")
        out.append("  </div>")
        return out

    if t == "scenario":
        # head like "Scenario 1 — Customer Information" or "Real-World Scenario 1"
        out.append(f"  <h2>{inline(head)}</h2>")
        # First h3 (## in spec) becomes scenario title
        out.append('  <div class="v2-callout scenario">')
        out.append('    <span class="v2-callout-label">Scenario</span>')
        rendered_open = True
        i = 0
        sub_label_pending = False
        question_options: list[str] = []
        in_q = False
        correct_answer = None
        for kind, payload in items:
            low = payload.lower() if isinstance(payload, str) else ""
            if kind == "h3":
                if "question" in low:
                    if rendered_open:
                        out.append("  </div>")
                        rendered_open = False
                    out.append("  <h3>Question</h3>")
                    in_q = True
                    continue
                if rendered_open:
                    out.append(f"    <p><strong>{inline(payload)}</strong></p>")
                else:
                    out.append(f"  <h3>{inline(payload)}</h3>")
                continue
            if kind == "h4":
                # A / B / C / D / Correct Answer / Outcome / Key Lesson
                if payload.upper() in ("A", "B", "C", "D"):
                    sub_label_pending = payload.upper()
                    continue
                if "correct answer" in low:
                    sub_label_pending = "_correct"
                    continue
                if "outcome" in low or "key lesson" in low:
                    if rendered_open:
                        out.append("  </div>")
                        rendered_open = False
                    out.append(f"  <h4>{inline(payload)}</h4>")
                    continue
                if rendered_open:
                    out.append(f"    <p><em>{inline(payload)}</em></p>")
                else:
                    out.append(f"  <h4>{inline(payload)}</h4>")
                continue
            if kind == "p":
                if sub_label_pending in ("A", "B", "C", "D"):
                    question_options.append((sub_label_pending, payload))
                    sub_label_pending = False
                    continue
                if sub_label_pending == "_correct":
                    correct_answer = payload
                    sub_label_pending = False
                    continue
                if in_q:
                    out.append(f"  <p>{inline(payload)}</p>")
                    continue
                if rendered_open:
                    out.append(f"    <p>{inline(payload)}</p>")
                else:
                    out.append(f"  <p>{inline(payload)}</p>")
                continue
            if kind == "ul":
                if rendered_open:
                    out.append("    <ul>")
                    for li in payload:
                        out.append(f"      <li>{inline(li)}</li>")
                    out.append("    </ul>")
                else:
                    out.append("  <ul>")
                    for li in payload:
                        out.append(f"    <li>{inline(li)}</li>")
                    out.append("  </ul>")
                continue
            if kind == "blockquote":
                if rendered_open:
                    out.append(f"    <blockquote>{inline(payload)}</blockquote>")
                else:
                    out.append(f"  <blockquote>{inline(payload)}</blockquote>")
                continue
        if rendered_open:
            out.append("  </div>")
        if question_options:
            out.append('  <ol type="A" class="v2-options">')
            for label, txt in question_options:
                out.append(f"    <li>{inline(txt)}</li>")
            out.append("  </ol>")
        if correct_answer:
            out.append('  <details class="v2-kc-answer"><summary>Show correct answer</summary>')
            out.append(f"  {inline(correct_answer)}</details>")
        return out

    if t == "rule":
        out.append('  <div class="v2-callout rule">')
        out.append(f'    <span class="v2-callout-label">{inline(head)}</span>')
        for kind, payload in items:
            out.extend(("    " + line for line in render_item(kind, payload, indent="    ")))
        out.append("  </div>")
        return out

    if t == "rag":
        out.append(f"  <h2>{inline(head)}</h2>")
        out.append('  <div class="v2-rag">')
        current_cell = None
        for kind, payload in items:
            if kind in ("h3", "h4"):
                lab = payload.upper()
                colour = None
                if "GREEN" in lab:
                    colour = "green"
                elif "AMBER" in lab:
                    colour = "amber"
                elif "RED" in lab:
                    colour = "red"
                if colour:
                    if current_cell:
                        out.append("    </div>")
                    short_label = payload.split("—")[0].strip().title() if "—" in payload else payload.title()
                    out.append(f'    <div class="v2-rag-cell {colour}">')
                    out.append(f"      <h4>{inline(short_label)}</h4>")
                    current_cell = colour
                    continue
                if current_cell:
                    out.append(f"      <p><strong>{inline(payload)}</strong></p>")
                continue
            if kind == "p":
                if current_cell:
                    out.append(f"      <p>{inline(payload)}</p>")
                continue
            if kind == "ul":
                if current_cell:
                    out.append("      <ul>")
                    for li in payload:
                        out.append(f"        <li>{inline(li)}</li>")
                    out.append("      </ul>")
                continue
        if current_cell:
            out.append("    </div>")
        out.append("  </div>")
        return out

    if t == "takeaways":
        out.append(f"  <h2>{inline(head)}</h2>")
        for kind, payload in items:
            out.extend(render_item(kind, payload))
        return out

    if t == "completion":
        # treat as a final closing block — render as h2 + body
        out.append(f"  <h2>{inline(head)}</h2>")
        for kind, payload in items:
            out.extend(render_item(kind, payload))
        return out

    if t == "exercise":
        out.append(f"  <h2>{inline(head)}</h2>")
        for kind, payload in items:
            out.extend(render_item(kind, payload))
        return out

    if t == "question":
        # M11 operational judgement question
        out.append("  <h3>Operational judgement</h3>")
        options: list[tuple[str, str]] = []
        prompt = None
        answer = None
        cur_label = None
        ans_pending = False
        for kind, payload in items:
            if kind == "h3" and prompt is None:
                prompt = payload
                continue
            if kind == "h4":
                if payload.upper() in ("A", "B", "C", "D"):
                    cur_label = payload.upper()
                    continue
                if "correct answer" in payload.lower():
                    ans_pending = True
                    continue
            if kind == "p":
                if cur_label:
                    options.append((cur_label, payload))
                    cur_label = None
                    continue
                if ans_pending:
                    answer = payload
                    ans_pending = False
                    continue
                if prompt is None:
                    prompt = payload
                    continue
        if prompt:
            out.append(f"  <p><strong>{inline(prompt)}</strong></p>")
        if options:
            out.append('  <ol type="A" class="v2-options">')
            for _, t in options:
                out.append(f"    <li>{inline(t)}</li>")
            out.append("  </ol>")
        if answer:
            out.append('  <details class="v2-kc-answer"><summary>Show correct answer</summary>')
            out.append(f"  {inline(answer)}</details>")
        return out

    # Default: generic section
    out.append(f"  <h2>{inline(head)}</h2>")
    for kind, payload in items:
        out.extend(render_item(kind, payload))
    return out


def render_item(kind: str, payload, indent: str = "  ") -> list[str]:
    if kind == "p":
        return [f"{indent}<p>{inline(payload)}</p>"]
    if kind == "h3":
        return [f"{indent}<h3>{inline(payload)}</h3>"]
    if kind == "h4":
        return [f"{indent}<h4>{inline(payload)}</h4>"]
    if kind == "blockquote":
        return [f"{indent}<blockquote>{inline(payload)}</blockquote>"]
    if kind == "ul":
        out = [f"{indent}<ul>"]
        for li in payload:
            out.append(f"{indent}  <li>{inline(li)}</li>")
        out.append(f"{indent}</ul>")
        return out
    return []


# ─────────── Inject into existing v2/module-N.html ───────────

MAIN_OPEN = re.compile(r'(<main\b[^>]*>)', re.IGNORECASE)
MAIN_CLOSE = re.compile(r'</main>', re.IGNORECASE)
EXISTING_REGEN = re.compile(re.escape(MARK_BEGIN) + r".*?" + re.escape(MARK_END), re.DOTALL)


def inject(path: Path, body_html: str) -> str:
    text = path.read_text(encoding="utf-8")
    # Find <main ...> ... </main>
    m_open = MAIN_OPEN.search(text)
    if not m_open:
        return "no-main"
    # Find matching closing main after the open
    close = MAIN_CLOSE.search(text, m_open.end())
    if not close:
        return "no-close"
    before = text[:m_open.end()]
    after = text[close.start():]
    new_block = "\n" + body_html + "\n"
    new = before + new_block + after
    if new == text:
        return "noop"
    path.write_text(new, encoding="utf-8")
    return "regenerated"


def main() -> int:
    spec = SPEC.read_text(encoding="utf-8")
    modules = split_modules(spec)
    total = 11
    summary: dict[str, int] = {}
    for mid in range(1, total + 1):
        if not modules[mid - 1]:
            summary["empty-spec"] = summary.get("empty-spec", 0) + 1
            print(f"  empty spec for module {mid}")
            continue
        parsed = parse_module(modules[mid - 1], mid)
        body = render_module(parsed, mid, total)
        path = V2 / f"module-{mid}.html"
        if not path.exists():
            summary["missing-file"] = summary.get("missing-file", 0) + 1
            print(f"  missing file: {path}")
            continue
        op = inject(path, body)
        summary[op] = summary.get(op, 0) + 1
        print(f"  {op:14s}  {path.relative_to(ROOT).as_posix()}  ({len(parsed['sections'])} sections, {len(parsed['outcomes'])} outcomes)")
    print("\nsummary:", summary)
    return 0


if __name__ == "__main__":
    sys.exit(main())
