import { Rsvp } from "../content";
import RemoteUrlReferenceExtractor from "./RemoteUrlReferenceExtractor";
import { Mf2Properties } from "~/types/mf2-document";

export default class RsvpMf2Extractor extends RemoteUrlReferenceExtractor {
    constructor(props: Mf2Properties) {
        super(props, 'in-reply-to');
    }

    getTitle(): string {
        return `RSVP for ${this.getEvent()}`
    }

    getMinimalTitle(): string {
        const rsvp = this.getRsvp()
        return `${rsvp[0].toUpperCase() + rsvp.slice(1)}: ${this.getRemoteUrlAbbrev()}`
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


    async getPost(): Promise<Rsvp> {
        return {
            type: 'rsvp',
            inReplyTo: this.remoteUrl,
            event: this.getEvent(),
            rsvp: this.getRsvp()
        }
    }
}
