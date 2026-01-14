import { z } from "astro:content"

export const Mf2DocumentSchema = z.object({
    type: z.array(z.string()),
    properties: z.record(z.array(z.unknown()))
})

export type Mf2Document = z.infer<typeof Mf2DocumentSchema>