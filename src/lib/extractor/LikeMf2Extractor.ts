import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";
import { Mf2Properties } from "~/types/mf2-document";
import { Like } from "../content";

export default class LikeMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
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
