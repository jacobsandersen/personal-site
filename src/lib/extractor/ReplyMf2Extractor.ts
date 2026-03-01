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

    getMinimalTitle(): string {
        return `Replied to ${this.getRemoteUrlAbbrev()}`
    }

    async getPost(): Promise<Reply> {
        return {
            type: 'reply',
            inReplyTo: this.getRemoteUrl(),
            content: this.getParsedContentProp()
        }
    }
}
