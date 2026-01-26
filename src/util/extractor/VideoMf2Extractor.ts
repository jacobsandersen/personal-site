import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { Content, text, vStack } from "~/types/content";

export default class VideoMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
        
    }

    getTitle(): string {
        return "Video Content";
    }

    getContent(): Content {
        return vStack(
            "sm",
            text("Video Content")
        )
    }

}