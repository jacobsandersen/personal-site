import { uuidv4 } from 'astro:schema';
import { z } from 'zod';

const envSchema = z.object({
  SEER_URL: z.url().default("http://example.org"),
  SEER_FIXED_AUTH: z.string().default(""),
  BASTION_URL: z.url().default("http://example.org"),
  BASTION_PUBLIC_URL: z.url().default("http://example.org"),
  PUBLIC_URL: z.url().default("http://example.org"),
  TELEMETRY_ENABLE: z.coerce.boolean().default(false),
  TELEMETRY_APP_ID: z.string().default("herald-default"),
  TELEMETRY_OTEL_EXPORTER_ENDPOINT: z.url().default("http://example.org"),
  TELEMETRY_OTEL_API_KEY: z.string().default(""),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(4321),
  NODE_ENV: z.enum(['development', 'production']).default('production'),
});

export const env = envSchema.parse({
  ...import.meta.env,
  ...process.env
});