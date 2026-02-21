import { Mf2Properties } from "~/types/mf2-document";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";
import { Repost } from "../content";

export default class RepostMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
        super(props, 'repost-of');
    }

    isCompactPreview(): boolean {
        return true
    }
    
    getTitle(): string {
        return `Repost from ${this.getLongCreatedFrom()}`;
    }

    async getPost(cache: KVNamespace<string>): Promise<Repost> {
        return {
            type: 'repost',
            repostOf: this.remoteUrl,
            referencedContent: await this.getRemoteContent(cache)
        }
    }
}
