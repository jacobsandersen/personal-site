import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { isValidUrl } from "~/util/url";
import { Photo } from "../content";

export default class PhotoMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
    }

    getTitle(): string {
        return `Photo ${this.getLongCreatedFrom()}`;
    }

    getMinimalTitle(): string {
        const numPhotos = this.getPhotoUrls().length;
        const photoText = numPhotos === 1 ? 'photo' : 'photos';
        return `Posted ${numPhotos === 1 ? "a" : numPhotos} ${photoText}`;
    }

    getPhotoUrls(): string[] {
        const photos = this.props.photo;
        if (!photos || photos.length === 0) {
            throw new Error("No photo URLs found for photo post");
        }

        return photos.filter(url => typeof url === 'string' && isValidUrl(url)) as string[];
    }

    async getPost(): Promise<Photo> {
        return {
            type: 'photo',
            photoUrls: this.getPhotoUrls(),
            content: this.getParsedContentProp()
        }
    }
}
