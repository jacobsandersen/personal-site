import { isValidUrl } from "~/util/url";
import Mf2Extractor from "./Mf2Extractor";
import { Mf2Properties } from "~/types/mf2-document";
import { Bookmark } from "../content";

export default class BookmarkMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
    }

    getTitle(): string {
        return `Bookmark ${this.getLongCreatedFrom()}`;
    }

    getBookmarkUrl(): string {
        const bookmarks = this.props['bookmark-of'];

        if (!bookmarks || bookmarks.length === 0) {
            throw new Error("No bookmark URLs found for bookmark post");
        }

        const validBookmarks = bookmarks.filter(url => typeof url === 'string' && isValidUrl(url)) as string[];
        if (validBookmarks.length === 0) {
            throw new Error("No valid bookmark URLs found for bookmark post");
        }

        return validBookmarks[0];
    }

    async getPost(): Promise<Bookmark> {
        return {
            type: 'bookmark',
            bookmarkOf: this.getBookmarkUrl(),
            content: this.getParsedContentProp()
        }
    }
}