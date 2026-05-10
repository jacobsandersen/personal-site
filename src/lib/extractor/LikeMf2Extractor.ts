import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";
import { Like } from "../content";
import { Mf2ObjectProperties } from "~/content.config";

export default class LikeMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2ObjectProperties) {
        super(props, 'like-of')
    }

    getTitle(): string {
        return `Liked Content ${this.getLongCreatedFrom()}`;
    }

    getMinimalTitle(): string {
        return `Liked ${this.getRemoteUrlAbbrev()}`
    }

    async getPost(): Promise<Like> {
        return {
            type: 'like',
            likeOf: this.getRemoteUrl(),
            content: this.getParsedContentProp()
        }
    }
}
