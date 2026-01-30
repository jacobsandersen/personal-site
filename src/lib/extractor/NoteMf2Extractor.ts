import Mf2Extractor from "./Mf2Extractor";
import { Content, stylizedQuote } from "~/lib/content";

export default class NoteMf2Extractor extends Mf2Extractor {
    getTitle(): string {
        return `Note ${this.getLongCreatedFrom()}`
    }

    async getContent(): Promise<Content> {
        const content = this.props.content
        if (!content || content.length === 0) {
            throw new Error("No content found for note")
        }

        return stylizedQuote(content[0] as string)
    }
}