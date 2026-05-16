import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://ddrscott.github.io')).toString().replace(/\/$/, '');
  const entries = await getCollection('blog');
  const sorted = entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const staticPaths = ['/', '/about/', '/projects/', '/archive/', '/tags/'];

  const urls: { loc: string; lastmod?: string }[] = [];
  for (const p of staticPaths) {
    urls.push({ loc: base + p });
  }
  for (const entry of sorted) {
    urls.push({
      loc: `${base}/blog/${entry.data.year}/${entry.data.slug}/`,
      lastmod: (entry.data.modified ?? entry.data.date).toISOString(),
    });
  }

  const tagSet = new Set<string>();
  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) {
      tagSet.add(tag);
    }
  }
  for (const tag of tagSet) {
    urls.push({ loc: `${base}/tags/${encodeURIComponent(tag)}/` });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
    ),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
