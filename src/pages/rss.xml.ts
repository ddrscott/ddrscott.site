import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const entries = await getCollection('blog');
  const sorted = entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Why, Scott, WHY?!?',
    description: 'Personal tech blog by Scott Pierce. SQL, Vim, Ruby, and AI tooling.',
    site: context.site ?? 'https://ddrscott.github.io',
    items: sorted.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description ?? '',
      link: `/blog/${entry.data.year}/${entry.data.slug}/`,
      categories: entry.data.tags ?? [],
    })),
    customData: '<language>en-us</language>',
  });
};
