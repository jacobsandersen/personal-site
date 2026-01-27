import Mf2Extractor from "./Mf2Extractor";
import { Content, map, text, vStack } from "~/types/content";

export interface Checkin {
    latitude: number,
    longitude: number,
    name: string
}

export default class CheckinMf2Extractor extends Mf2Extractor {
    getTitle(): string {
        return `Check-in ${this.getLongCreatedFrom()}`
    }
    
    getCheckin(): Checkin {
        const checkin = this.props.checkin
        if (!checkin || checkin.length === 0) {
            throw new Error("No check-in data found")
        }

        const checkinProps = (checkin as any[])[0].properties
        if (!checkinProps.latitude || checkinProps.latitude.length === 0 || !checkinProps.longitude || checkinProps.longitude.length === 0) {
            throw new Error("No latitude/longitude found for check-in")
        }

        const latitude = Number.parseFloat(checkinProps.latitude[0])
        const longitude = Number.parseFloat(checkinProps.longitude[0])
        const name = checkinProps.name?.[0] ?? "Unknown location"

        return {
            latitude,
            longitude,
            name
        }
    }

    getContent(): Content {
        const checkin = this.getCheckin()

        const content = this.props.content
        if (!content || content.length === 0) {
            throw new Error("No content found for check-in")
        }

        return vStack(
            "sm",
            map(checkin.latitude, checkin.longitude),
            text(`Checked in at ${checkin.name}`)
        )
    }
}