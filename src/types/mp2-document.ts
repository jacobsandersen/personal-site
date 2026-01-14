import { z } from "astro:content"

export const Mp2DocumentSchema = z.object({
    type: z.array(z.string()),
    properties: z.record(z.array(z.unknown()))
})

export type Mp2Document = z.infer<typeof Mp2DocumentSchema>