#!/usr/bin/env python3
"""
Check the ALPS repository's map of which pages describe which source code.

ALPS keeps .github/website-pages.json, which names, for each part of its
source, the pages under content/en that describe it; ALPS PRs that change
that code list those pages. This script checks the site's half:

  error    a page named in the map does not exist (renamed or deleted here)
  warning  a page under a watched section is neither mapped nor listed as
           unmapped (new pages should be added to the map in ALPS)
  warning  a mapped page has no zh-cn or ja version

Exits 1 on errors only. The map comes from ALPS master unless --map is given.

Run:  python3 scripts/check_source_map.py [--map path/to/website-pages.json]
"""

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
LANGUAGES = ("zh-cn", "ja")
MAP_URL = "https://raw.githubusercontent.com/ALPSim/ALPS/master/.github/website-pages.json"
MAP_LINK = "https://github.com/ALPSim/ALPS/blob/master/.github/website-pages.json"


def load_map(path):
    if path:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    with urllib.request.urlopen(MAP_URL, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def check(page_map, content=CONTENT):
    """(errors, warnings) for the map against the pages under content/."""
    en = content / "en"
    mapped = {page for entry in page_map["entries"] for page in entry["pages"]}
    unmapped = set(page_map.get("unmapped", {}))
    errors = ["%s is in the map but content/en/%s does not exist" % (page, page)
              for page in sorted(mapped | unmapped) if not (en / page).is_file()]
    warnings = []
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
    parser = argparse.ArgumentParser(description="Check ALPS's map of source code to site pages.")
    parser.add_argument("--map", help="a local website-pages.json instead of the one on ALPS master")
    args = parser.parse_args(argv)
    annotate = "GITHUB_ACTIONS" in os.environ
    try:
        page_map = load_map(args.map)
    except OSError as e:
        print(("::warning::" if annotate else "warning: ") +
              "could not read %s (%s); the source map was not checked" % (args.map or MAP_URL, e))
        return 0
    errors, warnings = check(page_map)
    for kind, messages in (("error", errors), ("warning", warnings)):
        for message in messages:
            print(("::%s::" % kind if annotate else "%s: " % kind) + message)
    if errors:
        print("Update the page paths in %s with the rename." % MAP_LINK)
    print("source map: %d entries, %d error(s), %d warning(s)"
          % (len(page_map["entries"]), len(errors), len(warnings)))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
