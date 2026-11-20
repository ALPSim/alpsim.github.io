#!/usr/bin/env python3
"""
Check .github/alps-source-map.json, the map of which pages describe which
files of the ALPS repository. Every ALPS PR lists the pages whose files it
changes (.github/scripts/website_pages.py in ALPSim/ALPS); this script keeps
the map in step with the pages here and the files there:

  error    the map is malformed, or a page it names does not exist
           (rename the page in the map with the page)
  warning  a page under a watched section is neither mapped nor listed as
           unmapped (new pages should be added to an entry, or to "unmapped")
  warning  a mapped page has no zh-cn or ja version
  warning  a source pattern matches no file in ALPS (given --alps); the
           files moved or were removed there

Exits 1 on errors only.

Run:  python3 scripts/check_source_map.py [--alps path/to/ALPS/checkout]
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
MAP = ROOT / ".github" / "alps-source-map.json"
LANGUAGES = ("zh-cn", "ja")


def glob_to_regex(pattern):
    """Translate a path glob to a regex: ** spans directories, * and ? do not.

    The same translation as .github/scripts/ci/fingerprint.py in ALPS.
    """
    out, i, n = [], 0, len(pattern)
    while i < n:
        c = pattern[i]
        if pattern.startswith("**/", i):
            out.append("(?:.*/)?")
            i += 3
        elif pattern.startswith("**", i):
            out.append(".*")
            i += 2
        elif c == "*":
            out.append("[^/]*")
            i += 1
        elif c == "?":
            out.append("[^/]")
            i += 1
        else:
            out.append(re.escape(c))
            i += 1
    return re.compile("".join(out) + r"\Z")


def alps_files(checkout):
    out = subprocess.run(["git", "-C", str(checkout), "ls-tree", "-r", "-z", "--name-only", "HEAD"],
                         stdout=subprocess.PIPE, check=True).stdout
    return [f for f in out.decode("utf-8", "surrogateescape").split("\0") if f]


def check(page_map, content=CONTENT, files=None):
    """(errors, warnings) for the map against the pages under content/ and the ALPS files."""
    en = content / "en"
    errors, warnings = [], []
    entries = page_map.get("entries")
    if not isinstance(entries, list) or not entries:
        return ["the map has no entries"], []
    mapped = set()
    for i, entry in enumerate(entries):
        name = entry.get("name") or "entry %d" % (i + 1)
        if not entry.get("sources") or not entry.get("pages"):
            errors.append("%s: needs both sources and pages" % name)
            continue
        for page in entry["pages"]:
            if page.startswith("/") or not page.endswith(".md"):
                errors.append("%s: page %r should be a .md path under content/en" % (name, page))
            mapped.add(page)
        if files is not None:
            for pattern in entry["sources"]:
                regex = glob_to_regex(pattern)
                if not any(regex.match(f) for f in files):
                    warnings.append("%s: %r matches no file in ALPS" % (name, pattern))
    unmapped = set(page_map.get("unmapped", {}))
    errors += ["%s is both mapped and listed as unmapped" % page for page in sorted(mapped & unmapped)]
    errors += ["%s is in the map but content/en/%s does not exist" % (page, page)
               for page in sorted(mapped | unmapped) if not (en / page).is_file()]
    for section in page_map.get("watched", []):
        for path in sorted((en / section).rglob("*.md")):
            page = path.relative_to(en).as_posix()
            if page not in mapped and page not in unmapped:
                warnings.append("%s is not in the map; add it to an entry, or to \"unmapped\"" % page)
    for page in sorted(mapped):
        missing = [lang for lang in LANGUAGES if (en / page).is_file() and not (content / lang / page).is_file()]
        if missing:
            warnings.append("%s has no %s version" % (page, " or ".join(missing)))
    return errors, warnings


def main(argv=None):
    parser = argparse.ArgumentParser(description="Check the map of ALPS files to site pages.")
    parser.add_argument("--alps", help="an ALPS checkout to check the source patterns against")
    args = parser.parse_args(argv)
    annotate = "GITHUB_ACTIONS" in os.environ
    page_map = json.loads(MAP.read_text(encoding="utf-8"))
    files = alps_files(args.alps) if args.alps else None
    errors, warnings = check(page_map, files=files)
    for kind, messages in (("error", errors), ("warning", warnings)):
        for message in messages:
            if annotate:
                print("::%s file=.github/alps-source-map.json::%s" % (kind, message))
            else:
                print("%s: %s" % (kind, message))
    print("source map: %d entries, %d error(s), %d warning(s)%s"
          % (len(page_map.get("entries") or []), len(errors), len(warnings),
             "" if files is not None else "; source patterns not checked (no --alps)"))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
