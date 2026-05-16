import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection('blog');
  return entries.map((entry) => ({
    params: { year: entry.data.year, slug: entry.data.slug },
    props: { sourcePath: entry.data.sourcePath },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const sourcePath = (props as { sourcePath: string }).sourcePath;
  const raw = await readFile(sourcePath, 'utf8');
  return new Response(raw, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
