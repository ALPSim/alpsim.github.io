# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The website for the ALPS (Algorithms and Libraries for Physics Simulations) project, hosted at https://alps.comp-phys.org/. Built with Hugo using a forked version of the [Hextra](https://github.com/iskakoff/hextra) theme (imported as a Go module).

## Development commands

```bash
# Serve locally with live reload (requires Hugo extended + Dart Sass)
hugo server

# Production build
hugo --gc --minify

# Build for a specific base URL
hugo --gc --minify --baseURL "https://alps.comp-phys.org/"
```

Hugo extended ≥ 0.112.0 and Dart Sass are required (the theme uses SCSS via `assets/sass/main.scss`).

## Content structure

All user-facing content lives under `content/` with three parallel language trees:

```
content/
  en/        # English (default)
  zh-cn/     # Simplified Chinese
  ja/        # Japanese
```

Each language mirrors the same section hierarchy: `about/`, `documentation/`, `events/`, `faqs/`, `govern/`, `opportunities/`, `tutorials/`.

**When editing content, all three language directories must stay in sync.** The English version is the source of truth; changes there should be propagated to `zh-cn/` and `ja/`.

## i18n strings

Short UI labels (nav items, footer text, search placeholder, etc.) live in `i18n/en.yaml`, `i18n/zh-cn.yaml`, `i18n/ja.yaml`. These are separate from page content.

## Theme and layouts

The site overrides parts of the upstream Hextra theme via local `layouts/`. Custom partials are in `layouts/partials/`. The theme itself is not vendored — it is fetched as a Go module (`go.mod` → `github.com/iskakoff/hextra`).

To update the theme: `hugo mod get -u` then `hugo mod tidy`.

## Deployment

Merging to `main` triggers the GitHub Actions workflow (`.github/workflows/hugo.yaml`), which builds with Hugo extended 0.115.4 and deploys to GitHub Pages automatically. There is no staging environment — preview locally before merging.

## Front matter conventions

Documentation pages typically include:
```yaml
---
title: Page Title
weight: <int>   # controls sidebar ordering
toc: true
cascade:
    type: docs
---
```

Shortcodes from Hextra (`{{% steps %}}`, `{{< callout >}}`, etc.) are used throughout the documentation pages.

## Tutorial page requirements

Every tutorial page (under `content/*/tutorials/`) must include all of the following sections, in roughly this order:

1. **Brief explanation of phenomena of interest** — one or two paragraphs describing the physics motivation (what is being studied and why it is interesting).
2. **Model definition or reference link** — the Hamiltonian written in LaTeX math, with a citation hyperlink (use `https://doi.org/<DOI>`) to the original paper(s) where the model is introduced or characterised.
3. **Parameter definitions** — a prose description or a markdown table listing every simulation parameter, its physical meaning, and the value(s) used.
4. **All parameter files shown** — the full content of every ALPS parameter file (e.g. `parm_spin1`) reproduced verbatim in a fenced code block.
5. **Lattice/graph choice with parameters labelled on the graph** — an ASCII skeleton diagram (or image) showing sites (`o`) and bonds with the Hamiltonian parameter names on the bonds/sites, followed by a short explanation of why this lattice was chosen.
6. **Lattice graph file or link** — either show the custom lattice XML file, or link to the relevant section of the [ALPS lattice library](../documentation/intro/latticehowtos) for built-in lattices.
7. **Method choice** — a brief section justifying the simulation method (e.g. `sparsediag`, `loop`, `worm`, DMRG) including an estimate of Hilbert space size or run time where helpful.
8. **All execution commands listed in detail** — every shell command needed to run the simulation, in order (`parameter2xml`, the application, any post-processing).
9. **Output data or plot** — a Python code block that reads the ALPS output files and a table (or description of a plot) of the actual numerical results produced by running the tutorial.
10. **Summary and outlook questions** — one or two sentences summarising what was found, followed by numbered extension questions that invite the reader to explore further.

Use `doi.org` canonical links for all paper citations (not journal-specific URLs, which can change).
