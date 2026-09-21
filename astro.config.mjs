// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  server: {
    allowedHosts: ["nonfallacious-disintegrative-donny.ngrok-free.dev"],
  },

  site: "https://jacobandersen.dev",

  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react()],

  adapter: node({
    mode: 'middleware'
  })
});