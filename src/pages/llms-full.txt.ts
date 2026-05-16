import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';

export const GET: APIRoute = async () => {
  const entries = await getCollection('blog');
  const sorted = entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const site = 'https://ddrscott.github.io';

  const parts: string[] = [];
  parts.push('# Why, Scott, WHY?!?');
  parts.push('');
  parts.push('> Full content of every published post. Personal tech blog by Scott Pierce.');
  parts.push('');

  for (const entry of sorted) {
    const url = `${site}/blog/${entry.data.year}/${entry.data.slug}/`;
    const dateStr = entry.data.date.toISOString().slice(0, 10);
    parts.push('---');
    parts.push('');
    parts.push(`# ${entry.data.title}`);
    parts.push('');
    parts.push(`Date: ${dateStr}`);
    parts.push(`URL: ${url}`);
    if (entry.data.tags && entry.data.tags.length > 0) {
      parts.push(`Tags: ${entry.data.tags.join(', ')}`);
    }
    if (entry.data.description) {
      parts.push(`Description: ${entry.data.description}`);
    }
    parts.push('');

    let body = entry.body ?? '';
    if (!body) {
      try {
        const raw = await readFile(entry.data.sourcePath, 'utf8');
        const split = raw.split(/^---\s*$/m);
        body = split.length >= 3 ? split.slice(2).join('---').trim() : raw;
      } catch {
        body = '';
      }
    }
    parts.push(body.trim());
    parts.push('');
  }

  return new Response(parts.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
