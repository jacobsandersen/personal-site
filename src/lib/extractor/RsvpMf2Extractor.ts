import { Content, container, link, text, TextNode } from "~/lib/content";
import ReplyMf2Extractor from "./ReplyMf2Extractor";
import { Mf2Properties } from "~/types/mf2-document";

export default class RsvpMf2Extractor extends ReplyMf2Extractor {
    constructor(props: Mf2Properties) {
        super(props);
    }

    getTitle(): string {
        return `RSVP for ${this.getEvent()}`
    }

    getRsvp(): string {
        const rsvpValues = this.props.rsvp

        if (!rsvpValues || rsvpValues.length === 0) {
            return "unknown"
        }

        return rsvpValues [0] as string
    }

    getEvent(): string {
        const event = this.props.content
        if (!event || event.length === 0) {
            throw new Error("No event found for RSVP")
        }

        return event[0] as string
    }


    async getContent(): Promise<Content> {
        const event = this.getEvent()
        const rsvp = this.getRsvp()

        const eventLink = link(this.remoteUrl, event, true)

        let fragment: TextNode
        switch (rsvp.toLowerCase()) {
            case 'yes':
                fragment = text("Is going to")
                break
            case 'no':
                fragment = text("Is not going to")
                break
            case 'maybe':
                fragment = text("Might be going to")
                break
            case 'interested':
                fragment = text("Is interested in")
                break
            default:
                fragment = text("Has an unknown RSVP for")
                break
        }

        return container([
            fragment,
            eventLink
        ], ["tw:flex", "tw:items-center", "tw:justify-center", "tw:gap-x-2"])
    }
}