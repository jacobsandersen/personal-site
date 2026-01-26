import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import { Content, text } from "~/types/content";
import { isValidUrl } from "../url";

export default class ReplyMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
    }

    getInReplyTo(): string {
        const inReplyTo = this.getFirstString('in-reply-to') || '';
        if (inReplyTo && isValidUrl(inReplyTo)) {
            return inReplyTo;
        }

        throw new Error('Invalid or missing in-reply-to URL');
    }

    getTitle(): string {
        return "Reply Content";
    }

    getContent(): Content {
        return text("Reply Content");
    }
}