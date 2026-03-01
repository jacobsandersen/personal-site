import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { isValidUrl } from "~/util/url";

export default abstract class RemoteUrlReferenceExtractor extends Mf2Extractor {
    protected readonly remoteUrl: string

    constructor(props: Mf2Properties, urlProp: string) {
        super(props);

        const remoteUrls = this.props[urlProp];
        if (!remoteUrls || remoteUrls.length === 0) {
            throw new Error(`Missing ${urlProp} property`);
        }

        const url = remoteUrls[0];
        if (typeof url !== 'string' || url.length === 0 || !isValidUrl(url)) {
            throw new Error(`Invalid ${urlProp} URL found for post`)
        }

        this.remoteUrl = url;
    }

    getRemoteUrl(): string {
        return this.remoteUrl;
    }

    getRemoteUrlAbbrev(): string {
        const maxLen = 24;
        if (this.remoteUrl.length <= maxLen) {
            return this.remoteUrl;
        }
        
        return `${this.remoteUrl.slice(0, maxLen)}...`;
    }
}
