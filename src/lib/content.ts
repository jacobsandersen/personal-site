export interface ContainerNode {
    type: "container",
    classes: string[],
    items: Content[]
}

export interface TextNode {
    type: "text"
    text: string,
    classes: string[]
}

export interface LinkNode {
    type: "link"
    url: string
    text?: string | null,
    external: boolean 
}

export interface HtmlNode {
    type: "html"
    html: string
}

export interface ImageNode {
    type: "image"
    url: string
    alt?: string | null
}

export interface VideoNode {
    type: "video"
    url: string
    poster?: string | null
}

export interface MapNode {
    type: "map",
    latitude: number,
    longitude: number
}

export interface ImageCollection {
    type: "image-collection",
    photos: ImageNode[]
}

export interface FlexContainer {
    type: "flex-container",
    classes: string[],
    items: Content[]
}

export type Content = TextNode | ImageNode | VideoNode | HtmlNode | LinkNode | MapNode | ImageCollection | ContainerNode

export const text = (value: string, classes: string[] = []): TextNode => ({
    type: "text",
    text: value,
    classes
})

export const link = (url: string, text?: string | null, external: boolean = false): LinkNode => ({
    type: "link",
    url,
    text,
    external
})

export const html = (value: string): HtmlNode => ({
    type: "html",
    html: value
})

export const image = (url: string, alt?: string | null): ImageNode => ({
    type: "image",
    url,
    alt
})

export const video = (url: string, poster?: string | null): VideoNode => ({
    type: "video",
    url,
    poster
})

export const map = (latitude: number, longitude: number): MapNode => ({
    type: "map",
    latitude,
    longitude
})

export const imageCollection = (...images: ImageNode[]): ImageCollection => ({
    type: "image-collection",
    photos: images
})

export const container = (items: Content[], classes: string[] = []): ContainerNode => ({
    type: "container",
    classes,
    items: items.filter(Boolean)
})