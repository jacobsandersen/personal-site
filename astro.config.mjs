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
  }),

  env: {
    schema: {
      SEER_URL: envField.string({ context: "server", access: "public", optional: false }),
      SEER_FIXED_AUTH: envField.string({ context: "server", access: "secret", optional: false }),
      TELEMETRY_ENABLE: envField.boolean({ context: "server", access: "public", default: false }),
      TELEMETRY_OTEL_EXPORTER_ENDPOINT: envField.string({ context: "server", access: "public", default: "" })
    }
  }
});