import { z } from 'zod';

const envSchema = z.object({
  SEER_URL: z.url(),
  SEER_FIXED_AUTH: z.string(),
  BASTION_URL: z.preprocess((v) => (v === "" ? undefined : v), z.url().default("http://dummy:3000")),
  TELEMETRY_ENABLE: z.coerce.boolean().default(false),
  TELEMETRY_OTEL_EXPORTER_ENDPOINT: z.url().optional(),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(4321),
  NODE_ENV: z.enum(['development', 'production']).default('production'),
});

export const env = envSchema.parse({
  ...import.meta.env,
  ...process.env
});