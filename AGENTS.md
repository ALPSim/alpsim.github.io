# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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
