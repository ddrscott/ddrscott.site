import type { Loader } from 'astro/loaders';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

export interface LifeContentLoaderOptions {
  contentRoot: string;
  publishTag: string;
}

const YEAR_DIR_RE = /^\d{4}$/;
const FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|markdown|mdx)$/;

function normalizeTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const out = new Set<string>();
  for (const tag of input) {
    const s = String(tag).trim().toLowerCase();
    if (s) out.add(s);
  }
  return [...out].sort();
}

export function lifeContentLoader(opts: LifeContentLoaderOptions): Loader {
  return {
    name: 'life-content',
    load: async ({ store, parseData, generateDigest, logger, renderMarkdown }) => {
      store.clear();

      const root = opts.contentRoot;
      let years: string[];
      try {
        const entries = await readdir(root, { withFileTypes: true });
        years = entries
          .filter((d: { isDirectory: () => boolean; name: string }) => d.isDirectory() && YEAR_DIR_RE.test(d.name))
          .map((d: { name: string }) => d.name)
          .sort();
      } catch (err) {
        logger.error(`Cannot read content root ${root}: ${(err as Error).message}`);
        return;
      }

      let loaded = 0;
      let skipped = 0;

      for (const year of years) {
        const yearDir = join(root, year);
        let files: string[];
        try {
          files = await readdir(yearDir);
        } catch (err) {
          logger.warn(`Skipping ${yearDir}: ${(err as Error).message}`);
          continue;
        }

        for (const filename of files) {
          const match = filename.match(FILENAME_RE);
          if (!match) continue;

          const slug = match[4];
          const filePath = join(yearDir, filename);

          let raw: string;
          try {
            raw = await readFile(filePath, 'utf8');
          } catch (err) {
            logger.warn(`Skipping ${filePath}: ${(err as Error).message}`);
            continue;
          }

          let parsed: matter.GrayMatterFile<string>;
          try {
            parsed = matter(raw);
          } catch (err) {
            logger.warn(`Skipping ${filePath} (frontmatter parse error): ${(err as Error).message}`);
            skipped += 1;
            continue;
          }
          const fm = parsed.data as Record<string, unknown>;

          if (!shouldPublish(fm, opts.publishTag)) {
            skipped += 1;
            continue;
          }

          const id = `${year}/${slug}`;

          const normalizedTags = normalizeTags(fm.tags);

          const data = await parseData({
            id,
            data: {
              ...fm,
              tags: normalizedTags,
              year,
              slug,
              filename,
              sourcePath: filePath,
            },
          });

          let rendered;
          try {
            rendered = await renderMarkdown(parsed.content);
          } catch (err) {
            logger.warn(`Skipping ${filePath} (markdown render error): ${(err as Error).message}`);
            skipped += 1;
            continue;
          }

          store.set({
            id,
            data,
            body: parsed.content,
            rendered,
            digest: generateDigest(raw),
          });

          loaded += 1;
        }
      }

      logger.info(`life-content: loaded ${loaded}, skipped ${skipped}`);
    },
  };
}

function shouldPublish(fm: Record<string, unknown>, publishTag: string): boolean {
  const publish = fm.publish;
  if (!Array.isArray(publish)) return false;
  if (!publish.includes(publishTag)) return false;

  const type = fm.type;
  if (type && type !== 'blog') return false;

  return true;
}
