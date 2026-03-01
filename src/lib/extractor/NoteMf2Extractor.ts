import { Note } from "../content";
import Mf2Extractor from "./Mf2Extractor";

export default class NoteMf2Extractor extends Mf2Extractor {
    getTitle(): string {
        return `Note ${this.getLongCreatedFrom()}`
    }

    getMinimalTitle(): string {
        return `Posted a note`
    }

    async getPost(): Promise<Note> {
        return {
            type: 'note',
            content: this.getParsedContentProp()
        }
    }
}
