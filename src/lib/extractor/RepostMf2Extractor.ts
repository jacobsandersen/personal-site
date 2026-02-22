import { Mf2Properties } from "~/types/mf2-document";
import { Repost } from "../content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";

export default class RepostMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
        super(props, 'repost-of');
    }

    getTitle(): string {
        return `Repost from ${this.getLongCreatedFrom()}`;
    }

    async getPost(): Promise<Repost> {
        return {
            type: 'repost',
            repostOf: this.remoteUrl
        }
    }
}
