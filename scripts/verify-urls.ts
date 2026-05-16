#!/usr/bin/env tsx
/**
 * verify-urls: ensure every URL in the deployed sitemap exists in the new build.
 *
 * Reads ../ddrscott.github.io/sitemap.xml (or path from $OLD_SITEMAP), extracts
 * URL paths, then checks that each path exists as a file inside ./dist/.
 *
 * Exits non-zero if any URL from the old sitemap is missing in the new build.
 * Optionally lists URLs that are new (warnings only).
 */
import { readFile, stat, readdir } from 'node:fs/promises';
import type { Dirent } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const distDir = join(projectRoot, 'dist');
const oldSitemapPath =
  process.env.OLD_SITEMAP ?? join(projectRoot, '..', 'ddrscott.github.io', 'sitemap.xml');

interface SitemapDoc {
  urlset?: { url?: Array<{ loc?: string }> | { loc?: string } };
}

function pathFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url;
  }
}

async function readOldSitemap(): Promise<Set<string>> {
  const raw = await readFile(oldSitemapPath, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false });
  const doc = parser.parse(raw) as SitemapDoc;
  const urlEntry = doc.urlset?.url;
  const items = Array.isArray(urlEntry) ? urlEntry : urlEntry ? [urlEntry] : [];
  const paths = new Set<string>();
  for (const item of items) {
    if (item.loc) paths.add(pathFromUrl(item.loc));
  }
  return paths;
}

async function walkDist(dir: string, prefix = ''): Promise<Set<string>> {
  const out = new Set<string>();
  let entries: Dirent[];
  try {
    entries = (await readdir(dir, { withFileTypes: true })) as Dirent[];
  } catch {
    return out;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    const urlPath = prefix + '/' + entry.name;
    if (entry.isDirectory()) {
      const inner = await walkDist(path, urlPath);
      for (const u of inner) out.add(u);
    } else if (entry.isFile()) {
      if (entry.name === 'index.html') {
        out.add(prefix + '/');
      } else if (entry.name.endsWith('.html')) {
        out.add(urlPath);
      } else {
        out.add(urlPath);
      }
    }
  }
  return out;
}

async function main() {
  try {
    await stat(distDir);
  } catch {
    console.error(`✘ dist/ not found at ${distDir}. Run 'pnpm build' first.`);
    process.exit(2);
  }

  const oldUrls = await readOldSitemap();
  const newUrls = await walkDist(distDir);

  // Normalize: drop the leading slash variations for comparison
  const normalize = (s: string) => (s === '' ? '/' : s);
  const oldSet = new Set([...oldUrls].map(normalize));
  const newSet = new Set([...newUrls].map(normalize));

  const missing: string[] = [];
  for (const url of oldSet) {
    if (!newSet.has(url)) missing.push(url);
  }

  const added: string[] = [];
  for (const url of newSet) {
    if (!oldSet.has(url) && url.startsWith('/blog/')) added.push(url);
  }

  console.log(`Old sitemap URLs: ${oldSet.size}`);
  console.log(`New dist URLs:    ${newSet.size}`);
  console.log('');

  if (missing.length > 0) {
    console.error(`✘ ${missing.length} URL(s) missing from new build:`);
    for (const url of missing) console.error(`  ${url}`);
    console.error('');
    console.error(`Refusing to ship. Old backlinks would break.`);
    process.exit(1);
  }

  if (added.length > 0) {
    console.log(`+ ${added.length} new blog URL(s) added (OK):`);
    for (const url of added.slice(0, 10)) console.log(`  ${url}`);
    if (added.length > 10) console.log(`  ... and ${added.length - 10} more`);
    console.log('');
  }

  console.log(`✓ All ${oldSet.size} legacy URLs are present in the new build.`);
}

main().catch((err) => {
  console.error('verify-urls failed:', err);
  process.exit(2);
});
