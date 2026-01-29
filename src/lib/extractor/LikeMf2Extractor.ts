import { container, Content, link, text } from "~/lib/content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";
import { Mf2Properties } from "~/types/mf2-document";
import { discoverExtractor } from "./ExtractorDiscoverer";

export default class LikeMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
        super(props, 'like-of')
    }

    getTitle(): string {
        return `Liked Content ${this.getLongCreatedFrom()}`;
    }

    async getContent(cache: KVNamespace<string>): Promise<Content> {
        const introContent = container([
            text("Liked"), 
            link(this.remoteUrl, null, true)
        ], ["flex", "items-center", "justify-center", "gap-x-2", "text-lg"])

        const likedDoc = await this.getRemoteHEntry(cache)

        const likedDocExtractor = likedDoc ? discoverExtractor(likedDoc.properties) : null
        const likedContent = likedDocExtractor ? await likedDocExtractor.getContent() : null
        
        if (likedContent) {
            return container([
                introContent,
                text("The liked content follows. If you enjoyed this, please visit the original post (link above)!"),
                container([
                    likedContent
                ], ["p-6", "rounded-md", "bg-blue-100", "dark:bg-blue-900", "border", "border-blue-300", "dark:border-blue-700"])
            ], ["flex", "flex-col", "items-center", "justify-center", "gap-y-4"])
        } else {
            return container([
                introContent,
                text("(No preview available - visit the URL to see the liked content)")
            ], ["flex", "flex-col", "items-center", "justify-center", "gap-y-4"])
        }
    }
}