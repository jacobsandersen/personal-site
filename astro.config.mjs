// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: "https://jacobandersen.dev",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react()],

  adapter: node({
    mode: 'standalone'
  })
});