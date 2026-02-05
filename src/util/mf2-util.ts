import { Mf2Properties } from "~/types/mf2-document"
import { isValidUrl } from "./url"
import { getDateParts } from "./dates"
import { create } from "node:domain"

export function getFirstStringOrBlank(properties: Mf2Properties, propertyName: string): string {
    return getFirstPropertyOrDefault<string>(properties, propertyName, "")
}

export function getFirstPropertyOrDefault<T>(properties: Mf2Properties, propertyName: string, defaultValue: T): T {
    const values = properties[propertyName]
    if (values && values.length > 0) {
        return values[0] as T
    }
    return defaultValue
}

export function hasPropWithValidUrl(props: Mf2Properties, propName: string): boolean {
    const values = props[propName]
    if (!values || values.length === 0) {
        return false
    }
    const propValue = values[0]
    return typeof propValue === 'string' && isValidUrl(propValue)
}

export function isValidRsvp(props: Mf2Properties): boolean {
    const rsvpValues = props.rsvp
    if (!rsvpValues || rsvpValues.length === 0) {
        return false
    }
    const rsvp = rsvpValues[0]
    return typeof rsvp === 'string' && ['yes', 'no', 'maybe', 'interested'].includes(rsvp.toLowerCase())
}

export function getPermalinkUrl(props: Mf2Properties): string {
    const slug = getFirstStringOrBlank(props, 'slug')
    if (!slug) {
        return ''
    }

    const createdAt = getFirstStringOrBlank(props, 'created_at')
    if (!createdAt) {
        return ''
    }

    const { year, month, day } = getDateParts(createdAt)

    return `/${year}/${month}/${day}/${slug}`
} 
    
