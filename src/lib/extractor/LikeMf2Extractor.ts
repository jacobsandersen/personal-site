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

    async getPost(cache: KVNamespace<string>): Promise<Like> {
        return {
            type: 'like',
            likeOf: this.remoteUrl,
            content: this.getParsedContentProp(),
            referencedContent: await this.getRemoteContent(cache)
        }
    }
}
