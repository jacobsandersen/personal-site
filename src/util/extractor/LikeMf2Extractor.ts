import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { Content, text } from "~/types/content";

export default class LikeMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);

    }

    getTitle(): string {
        return "Liked Content";
    }

    getContent(): Content {
        return text("Liked Content");
    }
}