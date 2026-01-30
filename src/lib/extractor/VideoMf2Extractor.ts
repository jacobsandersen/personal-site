import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { Content, container, text } from "~/lib/content";

export default class VideoMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
        
    }

    getTitle(): string {
        return "Video Content";
    }

    async getContent(): Promise<Content> {
        return container([
            text("Video Content")
        ], ["tw:flex", "tw:flex-col", "tw:items-center", "tw:justify-center", "tw:gap-y-4"]);
    }

}