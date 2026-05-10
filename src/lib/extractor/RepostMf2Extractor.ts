import { Mf2ObjectProperties } from "~/content.config";
import { Repost } from "../content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";

export default class RepostMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2ObjectProperties) {
        super(props, 'repost-of');
    }

    getTitle(): string {
        return `Repost from ${this.getLongCreatedFrom()}`;
    }

    getMinimalTitle(): string {
        return `Reposted ${this.getRemoteUrlAbbrev()}`
    }

    async getPost(): Promise<Repost> {
        return {
            type: 'repost',
            repostOf: this.remoteUrl
        }
    }
}
