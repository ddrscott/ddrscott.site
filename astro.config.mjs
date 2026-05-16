// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ddrscott.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  vite: {
    server: {
      allowedHosts: ['.dataturd.com', 'localhost'],
      fs: {
        allow: ['..', '/Users/spierce/life/content'],
      },
    },
  },
});
