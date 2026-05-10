import { defineCollection } from 'astro:content';

import { glob } from 'astro/loaders';

import { z } from 'astro/zod';

export type Mf2Value = string | boolean | number | Record<string, unknown> | Mf2Object;

export type Mf2ObjectProperties = Record<string, Mf2Value[]>;

export type Mf2Object = {
  type: string[];
  properties: Mf2ObjectProperties;
  children?: Mf2Object[] | null;
};

export const Mf2ValueSchema: z.ZodType<Mf2Value> = z.union([
  z.string(), 
  z.boolean(), 
  z.number(), 
  z.record(z.string(), z.unknown()),
  z.lazy(() => Mf2ObjectSchema)
]);

export const Mf2ObjectSchema = z.object({
  type: z.array(z.string()),
  properties: z.record(z.string(), z.array(Mf2ValueSchema)),
  get children() {
    return z.array(Mf2ObjectSchema).nullish();
  }
});

const micropub = defineCollection({
  loader: glob({ base: './micropub', pattern: '**/*.json' }),
  schema: Mf2ObjectSchema
});

export const collections = { micropub };