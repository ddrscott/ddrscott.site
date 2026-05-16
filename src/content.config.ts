import { defineCollection, z } from 'astro:content';
import { lifeContentLoader } from './content/loaders/life-content';

const LIFE_CONTENT_ROOT = '/Users/spierce/life/content';

const blog = defineCollection({
  loader: lifeContentLoader({
    contentRoot: LIFE_CONTENT_ROOT,
    publishTag: 'ddrscott',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    created: z.coerce.date().optional(),
    modified: z.coerce.date().optional(),
    type: z.string().default('blog'),
    status: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    publish: z.array(z.string()),
    source: z.string().optional(),
    prompt: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    comments: z.boolean().optional(),
    published: z.boolean().optional(),
    url: z.string().optional(),
    aliases: z.array(z.string()).optional(),

    year: z.string(),
    slug: z.string(),
    filename: z.string(),
    sourcePath: z.string(),
  }),
});

export const collections = { blog };
