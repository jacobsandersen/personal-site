import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { Content, container, image, imageCollection, text } from "~/lib/content";
import { isValidUrl } from "~/util/url";

export default class PhotoMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
    }

    getTitle(): string {
        return `Photo ${this.getLongCreatedFrom()}`;
    }

    getPhotoUrls(): string[] {
        const photos = this.props.photo;
        if (!photos || photos.length === 0) {
            throw new Error("No photo URLs found for photo post");
        }

        return photos.filter(url => typeof url === 'string' && isValidUrl(url)) as string[];
    }

    async getContent(): Promise<Content> {
        const photos = this.getPhotoUrls()
        
        let imageContent: Content
        if (photos.length === 1) {
            imageContent = image(photos[0])
        } else {
            imageContent = imageCollection(...photos.map(url => image(url)))
        }

        const content = this.props.content
        let contentNode: Content | null = null
        if (content && content.length > 0) {
            contentNode = text(content[0] as string)
        }

        return container([
            imageContent,
            ...(contentNode ? [contentNode] : [])
        ], ["tw:flex", "tw:flex-col", "tw:items-center", "tw:justify-center", "tw:gap-y-4"])
    }
}