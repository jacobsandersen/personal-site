export interface TextNode {
    type: "text"
    text: string
}

export interface LinkNode {
    type: "link"
    url: string
    text?: string
    external: boolean 
}

export interface HtmlNode {
    type: "html"
    html: string
}

export interface ImageNode {
    type: "image"
    url: string
    alt?: string
}

export interface VideoNode {
    type: "video"
    url: string
    poster?: string
}

export interface MapNode {
    type: "map",
    latitude: number,
    longitude: number
}

export type StackDirection = "vertical" | "horizontal";
export type StackGap = "sm" | "md" | "lg";

export interface ContentStack {
    type: "stack",
    direction: StackDirection,
    gap: StackGap,
    items: Content[]
}

export type Content = TextNode | ImageNode | VideoNode | HtmlNode | LinkNode | ContentStack | MapNode

export const text = (value: string): TextNode => ({
    type: "text",
    text: value
})

export const link = (url: string, text?: string, external: boolean = false): LinkNode => ({
    type: "link",
    url,
    text,
    external
})

export const html = (value: string): HtmlNode => ({
    type: "html",
    html: value
})

export const image = (url: string, alt?: string): ImageNode => ({
    type: "image",
    url,
    alt
})

export const video = (url: string, poster?: string): VideoNode => ({
    type: "video",
    url,
    poster
})

export const map = (latitude: number, longitude: number): MapNode => ({
    type: "map",
    latitude,
    longitude
})

export const contentStack = (direction: StackDirection, gap: StackGap, ...items: Content[]): ContentStack => ({
    type: "stack",
    direction,
    gap,
    items
})

export const vStack = (gap: StackGap, ...items: Content[]): ContentStack => contentStack("vertical", gap, ...items)

export const hStack = (gap: StackGap,...items: Content[]): ContentStack => contentStack("horizontal", gap, ...items)   