import { Mf2ObjectProperties } from "~/content.config";
import { Bookmark } from "../content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";

export default class BookmarkMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2ObjectProperties) {
        super(props, "bookmark-of");
    }

    getTitle(): string {
        return `Bookmark ${this.getLongCreatedFrom()}`;
    }

    getMinimalTitle(): string {
        return `Bookmarked ${this.getRemoteUrlAbbrev()}`
    }

    async getPost(): Promise<Bookmark> {
        return {
            type: 'bookmark',
            bookmarkOf: this.getRemoteUrl(),
            content: this.getParsedContentProp()
        }
    }
}