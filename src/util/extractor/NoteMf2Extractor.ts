import Mf2Extractor from "./Mf2Extractor";
import { Content, text } from "~/types/content";

export default class NoteMf2Extractor extends Mf2Extractor {
    getTitle(): string {
        return `Note ${this.getLongCreatedFrom()}`
    }

    getContent(): Content {
        const content = this.props.content
        if (!content || content.length === 0) {
            throw new Error("No content found for note")
        }

        return text(content[0] as string)
    }
}