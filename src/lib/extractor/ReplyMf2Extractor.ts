import { Reply } from "../content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";
import { Mf2Properties } from "~/types/mf2-document";

export default class ReplyMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
        super(props, 'in-reply-to');
    }

    getTitle(): string {
        return `Reply ${this.getLongCreatedFrom()}`;
    }

    async getPost(cache: KVNamespace<string>): Promise<Reply> {
        return {
            type: 'reply',
            inReplyTo: this.remoteUrl,
            content: this.getParsedContentProp(),
            referencedContent: await this.getRemoteContent(cache)
        }
    }
}
