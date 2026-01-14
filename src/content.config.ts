import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { Mp2DocumentSchema } from "./src/types/mp2-document";

const scribble = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/scribble" }),
    schema: Mp2DocumentSchema
})

export const collections = { scribble };