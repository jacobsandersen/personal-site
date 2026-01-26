import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { Content, text } from "~/types/content";

export default class RepostMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
        
    }

    getTitle(): string {
        return "Reposted Content";
    }

    getContent(): Content {
        return text("This is a reposted content item.");
    }

}