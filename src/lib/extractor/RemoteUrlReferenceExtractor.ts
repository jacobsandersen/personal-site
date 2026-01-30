import { Mf2Document, Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import attemptRetrieveRemoteMf2Docs from "../retriever/retriever";
import { Post } from "../content";
import { discoverExtractor } from "./ExtractorDiscoverer";

export default abstract class RemoteUrlReferenceExtractor extends Mf2Extractor {
    protected readonly remoteUrl: string

    constructor(props: Mf2Properties, urlProp: string) {
        super(props);

        const remoteUrls = this.props[urlProp];
        if (!remoteUrls || remoteUrls.length === 0) {
            throw new Error(`Missing ${urlProp} property`);
        }

        const url = remoteUrls[0];
        if (typeof url !== 'string' || url.length === 0) {
            throw new Error(`Invalid ${urlProp} URL found for post`)
        }

        this.remoteUrl = url;
    }

    async getRemoteHEntry(cache: KVNamespace<string>): Promise<Mf2Document | null> {
        const mf2Doc = await attemptRetrieveRemoteMf2Docs(this.remoteUrl, cache, ["h-entry"]);
        if (mf2Doc.length === 0) {
            return null
        }

        return mf2Doc[0];
    }

    async getRemoteContent(cache: KVNamespace<string>): Promise<Post | null> {
        const doc = await this.getRemoteHEntry(cache)
        const extractor = doc ? discoverExtractor(doc.properties) : null
        return extractor ? await extractor.getPost() : null
    }
}
