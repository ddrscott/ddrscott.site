import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const entries = await getCollection('blog');
  const sorted = entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const site = 'https://ddrscott.github.io';

  const lines: string[] = [];
  lines.push('# Why, Scott, WHY?!?');
  lines.push('');
  lines.push('> Personal tech blog by Scott Pierce. SQL, Vim, Ruby, AI tooling, and tools for problems no one thinks they have.');
  lines.push('');
  lines.push(`Articles below are the canonical posts at ${site}. Each line links to a human-readable page; append \`.md\` to any blog URL to get the raw markdown source. The full archive is also available at ${site}/llms-full.txt.`);
  lines.push('');
  lines.push('## Posts');
  lines.push('');

  for (const entry of sorted) {
    const url = `${site}/blog/${entry.data.year}/${entry.data.slug}/`;
    const desc = entry.data.description ?? '';
    const tail = desc ? `: ${desc}` : '';
    lines.push(`- [${entry.data.title}](${url})${tail}`);
  }

  lines.push('');
  lines.push('## Other pages');
  lines.push('');
  lines.push(`- [About](${site}/about/): Who Scott is and what this blog is about.`);
  lines.push(`- [Projects](${site}/projects/): Scott's public software projects.`);
  lines.push(`- [Archive](${site}/archive/): Full chronological archive.`);

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
