"""Generate per-post SVG Open Graph cards and rewrite og:image references.

For each blog/<slug>/index.html:
  - parse <title> (strip " | John Kihiu")
  - parse the .tag span content
  - write assets/og/<slug>.svg (1200x630 branded card)
  - replace og:image meta + JSON-LD image to point at /assets/og/<slug>.svg
"""
from __future__ import annotations
import re
from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / "blog"
OG_DIR = ROOT / "assets" / "og"
OG_DIR.mkdir(parents=True, exist_ok=True)

SITE = "https://kihiujohn.github.io"

TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r'<span class="tag">(.*?)</span>', re.IGNORECASE | re.DOTALL)
OG_IMG_RE = re.compile(
    r'(<meta property="og:image" content=")[^"]+(")', re.IGNORECASE
)
TW_IMG_RE = re.compile(
    r'(<meta name="twitter:image" content=")[^"]+(")', re.IGNORECASE
)
JSONLD_IMG_RE = re.compile(r'("image"\s*:\s*")[^"]+(")')


def wrap_title(title: str, max_chars: int = 26) -> list[str]:
    words = title.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        candidate = f"{cur} {w}".strip()
        if len(candidate) <= max_chars or not cur:
            cur = candidate
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    # Cap at 3 lines; tail-ellipsise if overflow
    if len(lines) > 3:
        lines = lines[:3]
        lines[-1] = lines[-1][: max_chars - 1].rstrip() + "…"
    return lines


def svg_escape(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def topic_footer(title: str, tag: str) -> str:
    blob = f"{title} {tag}".lower()
    if "laravel" in blob or "php" in blob:
        return "Laravel · PHP · Nairobi"
    if "acumatica" in blob:
        return "Acumatica ERP · Nairobi"
    if "azure" in blob or "aws" in blob or "cloud" in blob:
        return "Cloud Engineering · Nairobi"
    if "kra" in blob or "etims" in blob or "rra" in blob or "zra" in blob or "vsdc" in blob or "fdms" in blob or "fiscal" in blob:
        return "Tax Fiscalisation · Nairobi"
    return "John Kihiu · Nairobi"


def build_svg(title: str, tag: str) -> str:
    lines = wrap_title(title)
    footer = topic_footer(title, tag)
    # Vertical centre block of 1-3 lines, line-height 78px
    line_h = 78
    block_h = line_h * len(lines)
    start_y = 315 - block_h // 2 + 56  # baseline of first line
    text_lines = ""
    for i, ln in enumerate(lines):
        y = start_y + i * line_h
        text_lines += (
            f'<text x="80" y="{y}" font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif" '
            f'font-size="64" font-weight="800" fill="#FAFAF9" letter-spacing="-1.5">'
            f"{svg_escape(ln)}</text>\n  "
        )
    tag_safe = svg_escape(tag.upper())
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0C0A09"/>
      <stop offset="1" stop-color="#1C1917"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="14" height="630" fill="#059669"/>
  <text x="80" y="110" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" fill="#10B981" letter-spacing="4">{tag_safe}</text>
  {text_lines}<text x="80" y="555" font-family="Inter, system-ui, sans-serif" font-size="26" font-weight="700" fill="#FAFAF9">John Kihiu</text>
  <text x="80" y="590" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="500" fill="#A8A29E">{svg_escape(footer)}</text>
  <text x="1120" y="590" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="600" fill="#059669" text-anchor="end">kihiujohn.github.io</text>
</svg>
"""


def process(path: Path) -> bool:
    slug = path.parent.name
    raw = path.read_text(encoding="utf-8")
    tm = TITLE_RE.search(raw)
    if not tm:
        return False
    full = unescape(tm.group(1).strip())
    title = full.split("|")[0].strip() if "|" in full else full
    tag_match = TAG_RE.search(raw)
    tag = unescape(tag_match.group(1).strip()) if tag_match else "Acumatica"

    svg = build_svg(title, tag)
    (OG_DIR / f"{slug}.svg").write_text(svg, encoding="utf-8", newline="\n")

    new_url = f"{SITE}/assets/og/{slug}.svg"
    new_raw = raw
    new_raw = OG_IMG_RE.sub(rf"\g<1>{new_url}\g<2>", new_raw)
    new_raw = TW_IMG_RE.sub(rf"\g<1>{new_url}\g<2>", new_raw)
    new_raw = JSONLD_IMG_RE.sub(rf"\g<1>{new_url}\g<2>", new_raw)
    if new_raw != raw:
        path.write_text(new_raw, encoding="utf-8", newline="\n")
    return True


LISTING_IMG_RE = re.compile(
    r'(<a class="blog-img" href="/blog/([^"/]+)/"[^>]*>\s*<img src=")[^"]+(")',
    re.IGNORECASE,
)


def rewrite_listing() -> int:
    listing = BLOG / "index.html"
    raw = listing.read_text(encoding="utf-8")
    def repl(m: re.Match[str]) -> str:
        slug = m.group(2)
        return f"{m.group(1)}{SITE}/assets/og/{slug}.svg{m.group(3)}"
    new_raw, n = LISTING_IMG_RE.subn(repl, raw)
    if new_raw != raw:
        listing.write_text(new_raw, encoding="utf-8", newline="\n")
    return n


def main() -> None:
    count = 0
    skipped: list[str] = []
    for p in sorted(BLOG.glob("*/index.html")):
        if p.parent.name == "" or p.name != "index.html" or p.parent == BLOG:
            continue
        if process(p):
            count += 1
        else:
            skipped.append(p.parent.name)
    print(f"Processed posts: {count}")
    if skipped:
        print(f"Skipped (no <title>): {skipped}")
    n = rewrite_listing()
    print(f"Rewrote listing thumbnails: {n}")


if __name__ == "__main__":
    main()
