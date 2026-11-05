// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // server: {
  //   allowedHosts: ["nonfallacious-disintegrative-donny.ngrok-free.dev"],
  // },

  // site: "https://nonfallacious-disintegrative-donny.ngrok-free.dev",

  site: "https://jacobandersen.dev",

  security: {
    // Astro only trusts the request Host header for Astro.url when it matches
    // an allowed domain. Without this, Astro.url falls back to localhost,
    // which breaks canonical permalink lookups and generated links behind the
    // reverse proxy.
    allowedDomains: [
      { hostname: 'jacobandersen.dev' },
      { hostname: 'staging.jacobandersen.dev' },
      { hostname: 'localhost' },
    ],
  },

  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react()],

  adapter: node({
    mode: 'middleware'
  })
});