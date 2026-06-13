#!/usr/bin/env python3
"""
Build a search index from content/en/**/*.md for the chatbot fallback.
Output: static/data/docs-index.json

Each entry:
  { "title": "...", "url": "/...", "sections": [ {"h": "heading", "t": "snippet"}, ... ] }

Run:  python3 scripts/build_docs_index.py
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content" / "en"
OUTPUT = ROOT / "static" / "data" / "docs-index.json"

# Skip files that are just index pages with very little content
MIN_TEXT_LEN = 80

# Matches the opening of a fenced code block (3+ backticks or tildes)
_FENCE_RE = re.compile(r'^(`{3,}|~{3,})')

# Front matter: allow optional leading blank lines before the opening ---
_FM_RE = re.compile(r'^\s*---\s*\n(.*?)\n---\s*\n', re.DOTALL)


def parse_frontmatter(text):
    m = _FM_RE.match(text)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).splitlines():
        if ':' in line:
            k, _, v = line.partition(':')
            fm[k.strip()] = v.strip().strip('"\'')
    return fm


def strip_markdown(text):
    # Remove script/style blocks including their content before stripping tags
    text = re.sub(r'<script\b[^>]*>.*?</script>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style\b[^>]*>.*?</style>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'\$\$.*?\$\$', ' ', text, flags=re.DOTALL)      # display math
    text = re.sub(r'\$[^$\n]+\$', ' ', text)                        # inline math
    text = re.sub(r'`{3,}.*?`{3,}', ' ', text, flags=re.DOTALL)    # fenced code (3+ backticks)
    text = re.sub(r'`[^`]+`', ' ', text)                            # inline code
    text = re.sub(r'^\s*>.*', '', text, flags=re.MULTILINE)         # blockquotes
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)            # links → text
    text = re.sub(r'[*_]{1,2}([^*_\n]+)[*_]{1,2}', r'\1', text)    # bold/italic
    text = re.sub(r'<[^>]+>', ' ', text)                             # remaining HTML tags
    text = re.sub(r'\{\{[^}]+\}\}', ' ', text)                      # Hugo shortcodes
    text = re.sub(r'\{[^}]+\}', ' ', text)                          # shortcode args
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def file_to_url(path: Path) -> str:
    rel = path.relative_to(CONTENT_DIR)
    parts = list(rel.parts)
    if parts[-1] == '_index.md':
        parts = parts[:-1]
        return '/' + '/'.join(parts) if parts else '/'
    parts[-1] = parts[-1][:-3]  # strip .md
    return '/' + '/'.join(parts)


def extract_sections(body: str) -> list:
    """Split body into sections by heading, skipping content inside fenced code blocks."""
    sections = []
    current_heading = ''
    current_lines = []
    in_fence = False

    for line in body.splitlines():
        if _FENCE_RE.match(line):
            in_fence = not in_fence
            continue  # don't include fence markers in text

        if in_fence:
            continue  # skip code content so #include / ##SBATCH aren't treated as headings

        m = re.match(r'^(#{1,4})\s+(.+)', line)
        if m:
            if current_lines:
                snippet = strip_markdown('\n'.join(current_lines)).strip()
                if len(snippet) >= MIN_TEXT_LEN:
                    sections.append({'h': current_heading, 't': snippet[:500]})
            current_heading = strip_markdown(m.group(2)).strip()
            current_lines = []
        else:
            current_lines.append(line)

    # Last section
    if current_lines:
        snippet = strip_markdown('\n'.join(current_lines)).strip()
        if len(snippet) >= MIN_TEXT_LEN:
            sections.append({'h': current_heading, 't': snippet[:500]})

    return sections


def build_index() -> list:
    entries = []

    for md_file in sorted(CONTENT_DIR.rglob('*.md')):
        text = md_file.read_text(encoding='utf-8')

        fm_match = _FM_RE.match(text)
        if fm_match:
            fm = parse_frontmatter(text)
            body = text[fm_match.end():]
        else:
            fm = {}
            body = text

        title = fm.get('title', md_file.stem)
        url = file_to_url(md_file)

        if len(body.strip()) < MIN_TEXT_LEN:
            continue

        sections = extract_sections(body)
        if not sections:
            snippet = strip_markdown(body).strip()
            if len(snippet) >= MIN_TEXT_LEN:
                sections = [{'h': '', 't': snippet[:500]}]

        if not sections:
            continue

        entries.append({'title': title, 'url': url, 'sections': sections})

    return entries


if __name__ == '__main__':
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    index = build_index()
    OUTPUT.write_text(json.dumps(index, ensure_ascii=False, separators=(',', ':')))
    sizes = [len(e['sections']) for e in index]
    print(f'Built docs index: {len(index)} pages, '
          f'{sum(sizes)} sections → {OUTPUT.relative_to(ROOT)}')
