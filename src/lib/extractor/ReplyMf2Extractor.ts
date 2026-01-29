import { Content, text } from "~/lib/content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";
import { Mf2Properties } from "~/types/mf2-document";

export default class ReplyMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
        super(props, 'in-reply-to');
    }

    getTitle(): string {
        return "Reply Content";
    }

    async getContent(): Promise<Content> {
        return text("Reply Content");
    }
}