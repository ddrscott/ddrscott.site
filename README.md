# ddrscott.site

Astro source for [ddrscott.github.io](https://ddrscott.github.io). Replaces the previous MkDocs Material setup.

Articles live in `~/life/content/` (FUSE-mounted from R2). Anything with frontmatter `publish: [ddrscott]` and `type: blog` ships here. Other destinations (askscottpierce, dataturd) can filter the same source on their own tags.

## URL contract

Every URL in `../ddrscott.github.io/sitemap.xml` must continue to resolve after a rebuild. The `verify-urls` script enforces this — `make deploy` refuses to ship if any legacy URL disappears.

Pattern: filename `YYYY-MM-DD-slug.md` → `/blog/{year}/{slug}/`. Strip the date prefix, take the year from the parent directory.

## Stack

- **Astro 6** with static export (`output: 'static'`, `trailingSlash: 'always'`)
- **Custom Content Loader** at `src/content/loaders/life-content.ts` reads `~/life/content/`, filters by `publish: [ddrscott]`, and uses `renderMarkdown` from the loader context
- **MDX integration** for any future MDX content
- **No JS framework** — vanilla Astro components

## Layout

```
src/
├── content.config.ts            # collection schema + loader wiring
├── content/loaders/
│   └── life-content.ts          # custom loader: ~/life/content → 'blog' collection
├── layouts/
│   ├── Base.astro               # HTML shell, header, footer, meta
│   └── Article.astro            # article wrapper with Disqus
├── components/
│   └── PostCard.astro           # grid card for index
├── pages/
│   ├── index.astro              # latest posts (with image)
│   ├── about.astro
│   ├── projects.astro
│   ├── archive.astro
│   ├── 404.astro
│   ├── blog/[year]/[slug]/
│   │   └── index.astro          # article page → /blog/{year}/{slug}/
│   ├── blog/[year]/[slug].md.ts # raw markdown endpoint → /blog/{year}/{slug}.md
│   ├── tags/[tag].astro         # tag listing
│   ├── tags/index.astro         # all tags
│   ├── llms.txt.ts              # llms.txt index
│   ├── llms-full.txt.ts         # llms-full.txt (every post inlined)
│   ├── rss.xml.ts               # RSS feed
│   └── sitemap.xml.ts           # sitemap (custom; @astrojs/sitemap was broken with content loader)
└── styles/global.css            # color palette + typography (preserves DESIGN.md tokens)
```

## Build & deploy

```sh
make install      # pnpm install --ignore-workspace
make sync-images  # rclone copy r2:life-content/ddrscott/images → public/images/
make build        # sync-images + pnpm build → dist/
make verify       # build + check every legacy URL still resolves
make preview      # local preview server
make deploy       # verify + rsync into ../ddrscott.github.io + commit
                  # (still requires you to `git push` after reviewing)
```

`public/images/` is gitignored — it's resynced from R2 each build.

## Why ~/life as the canonical source

- Every post is also a normal note in Scott's knowledge base
- Same article can be cross-published (e.g. `publish: [ddrscott, askscottpierce]`) by adding another destination repo with its own filter
- FUSE-mounted R2 means writes from iOS, other machines, or AI agents all reach the bucket; the blog rebuilds from the bucket

## New features beyond MkDocs

- **`/llms.txt`** — index of every post for LLM crawlers (per <https://llmstxt.org/>)
- **`/llms-full.txt`** — every post concatenated inline
- **`/blog/{year}/{slug}.md`** — raw markdown download per post (button in the article footer)
- **Tag pages** — `/tags/{tag}/` listing for each tag, plus `/tags/` index
- **RSS** — `/rss.xml`

## Preserved from MkDocs

- Disqus thread continuity — `data-disqus-identifier` matches the legacy URL path
- Plausible analytics (`plausible.dataturd.com` for `ddrscott.github.io`)
- Twitter / OG image meta
- Blue-grey / orange color tokens
- GitHub Sponsors button (on About page)

## Adding a post

Don't add posts here. Add them to `~/life/content/{year}/{YYYY-MM-DD}-slug.md` with frontmatter:

```yaml
---
title: My Post Title
date: 2026-05-15
type: blog
status: settled
publish: [ddrscott]
tags: [sql, vim]
description: One-line description for the index and og:description.
image: /images/2026/featured.png  # optional
---
```

Then `make build` here pulls it in automatically. To use a featured image, drop it in `~/life/content/images/{year}/` first.

## Legacy

The previous MkDocs source is preserved under `legacy/` for reference (not built). The MkDocs custom Python plugin powered a "recent posts with image" filter that's now handled by `getCollection('blog').filter((e) => e.data.image)` in `src/pages/index.astro`.

## Rollback

If the new site breaks something on deploy, `git -C ../ddrscott.github.io reset --hard pre-astro-migration` restores the MkDocs-era HEAD.
