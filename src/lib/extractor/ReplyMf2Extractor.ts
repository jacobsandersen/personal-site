import { Mf2ObjectProperties } from "~/content.config";
import { Reply } from "../content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";

export default class ReplyMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2ObjectProperties) {
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
