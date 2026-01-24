import { z } from "astro:content"

export const Mf2PropertiesSchema = z.record(z.array(z.unknown()))

export type Mf2Properties = z.infer<typeof Mf2PropertiesSchema>

export const Mf2DocumentSchema = z.object({
    type: z.array(z.string()),
    properties: Mf2PropertiesSchema
})

export type Mf2Document = z.infer<typeof Mf2DocumentSchema>