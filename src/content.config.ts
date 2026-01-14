import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { Mf2DocumentSchema } from "./types/mf2-document";

const scribble = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/scribble" }),
    schema: Mf2DocumentSchema
})

export const collections = { scribble };