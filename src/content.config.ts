import { defineCollection } from 'astro:content';

import { glob } from 'astro/loaders';

import { z } from 'astro/zod';


type Mf2Value = string | boolean | number | Record<string, unknown> | Mf2Object;

type Mf2Object = {
  type: string[];
  properties: Map<string, Mf2Value[]>;
  children?: Mf2Object[];
};

const Mf2ValueSchema: z.ZodType<Mf2Value> = z.union([
  z.string(), 
  z.boolean(), 
  z.number(), 
  z.record(z.string(), z.unknown()),
  z.lazy(() => Mf2ObjectSchema)
]);

const Mf2ObjectSchema: z.ZodType<Mf2Object> = z.object({
  type: z.array(z.string()),
  properties: z.map(z.string(), z.array(Mf2ValueSchema)),
  get children() {
    return z.array(Mf2ObjectSchema).optional();
  }
});

const micropub = defineCollection({
  loader: glob({ base: './micropub', pattern: '**/*.json' }),
  schema: Mf2ObjectSchema
});

export const collections = { micropub };