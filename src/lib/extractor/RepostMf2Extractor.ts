import { Mf2Properties } from "~/types/mf2-document";
import { Content, text } from "~/lib/content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";

export default class RepostMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
        super(props, 'repost-of');
    }

    getTitle(): string {
        return "Reposted Content";
    }

    async getContent(): Promise<Content> {
        return text("This is a reposted content item.");
    }

}