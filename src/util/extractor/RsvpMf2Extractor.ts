import { Content, hStack, link, text, TextNode } from "~/types/content";
import ReplyMf2Extractor from "./ReplyMf2Extractor";

export default class RsvpMf2Extractor extends ReplyMf2Extractor {
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


    getContent(): Content {
        const event = this.getEvent()
        const rsvp = this.getRsvp()

        const eventLink = link(this.getInReplyTo(), event, true)

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

        return hStack("sm", fragment, eventLink)
    }
}