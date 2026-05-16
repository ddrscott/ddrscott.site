# ddrscott.site (Astro)

Astro static site for ddrscott.github.io. Source of truth for articles is `~/life/content/` filtered by `publish: [ddrscott]`. **Do not add articles to this repo** — they live in `~/life/content/{year}/`.

See [README.md](README.md) for the full setup. This file is for Claude-specific guidance.

## When the user says "edit a post"

Locate the source file in `~/life/content/{year}/`. Use the filename pattern `YYYY-MM-DD-{slug}.md` where the slug matches the URL segment after `/blog/{year}/`.

Example: post at `/blog/2025/nano-banana-2/` → source at `~/life/content/2025/2025-11-23-nano-banana-2.md`.

## When the user says "create a new post"

Create in `~/life/content/{current-year}/{YYYY-MM-DD}-{slug}.md` with frontmatter:

```yaml
---
title: ...
date: YYYY-MM-DD
type: blog
status: settled
publish: [ddrscott]
tags: [...]
description: ...
image: /images/YYYY/...  # optional, must exist in ~/life/content/images/
---
```

Then build here to publish.

## When the user wants to rebuild / deploy

```sh
cd /Users/spierce/code/ddrscott.site
make build        # → dist/
make verify       # confirms no legacy URLs were dropped
make deploy       # rsync into ../ddrscott.github.io + commit (still requires manual push)
```

Confirm with the user before pushing. `make deploy` already creates the commit — pushing publishes.

## URL preservation

`verify-urls` script reads `../ddrscott.github.io/sitemap.xml` and asserts every URL is still present in `dist/`. If `make verify` fails, do not deploy until the missing URLs are restored.

The current contract:
- `/blog/{year}/{slug}/` → article HTML
- `/blog/{year}/{slug}.md` → raw markdown (new feature)
- `/about/`, `/projects/`, `/archive/` → static pages
- `/llms.txt`, `/llms-full.txt`, `/rss.xml`, `/sitemap.xml` → endpoints

## Frontmatter parsing failures

The loader logs warnings and skips files whose frontmatter is malformed (e.g. Jinja includes in YAML, missing colons). Known offenders as of migration:
- `2024-05-09-subcontractor-template.md` — Jinja include
- `2024-07-15-retainer-template.md` — Jinja include
- `2024-07-16-tech-advisor-monthly.md` — Jinja include
- `2024-07-16-tech-partner-long-term.md` — Jinja include
- `2025-06-11-green-eggs-and-ham.md` — unquoted colon in `prompt:` field

These are not in the deployed sitemap, so verify-urls passes. If the user wants to publish them, fix the frontmatter in the source files.

## Style references

`DESIGN.md` describes the visual system (blue-grey primary `#607d8b`, orange accent `#ff9800`). `src/styles/global.css` is the Astro implementation. Keep new components consistent with those tokens.

## Don't

- Don't add posts inside this repo. Source-of-truth is `~/life/content/`.
- Don't commit `public/images/` — it's regenerated from R2 each build.
- Don't bypass `make verify` before deploy. Backlinks matter.
- Don't `git push --force` to `ddrscott.github.io` without checking what it overwrites.
