import { isValidUrl } from "./url"
import { getDateParts } from "./dates"
import { Mf2ObjectProperties } from "~/content.config"

export function getFirstStringOrBlank(properties: Mf2ObjectProperties, propertyName: string): string {
    return getFirstPropertyOrDefault<string>(properties, propertyName, "")
}

export function getFirstPropertyOrDefault<T>(properties: Mf2ObjectProperties, propertyName: string, defaultValue: T): T {
    const values = properties[propertyName]
    if (values && values.length > 0) {
        return values[0] as T
    }
    return defaultValue
}

export function hasPropWithValidUrl(props: Mf2ObjectProperties, propName: string): boolean {
    const values = props[propName]
    if (!values || values.length === 0) {
        return false
    }
    const propValue = values[0]
    return typeof propValue === 'string' && isValidUrl(propValue)
}

export function isValidRsvp(props: Mf2ObjectProperties): boolean {
    const rsvpValues = props.rsvp
    if (!rsvpValues || rsvpValues.length === 0) {
        return false
    }
    const rsvp = rsvpValues[0]
    return typeof rsvp === 'string' && ['yes', 'no', 'maybe', 'interested'].includes(rsvp.toLowerCase())
}

export function getPermalinkUrl(props: Mf2ObjectProperties): string {
    const slug = getFirstStringOrBlank(props, 'mp-slug')
    if (!slug) {
        return ''
    }

    const createdAt = getFirstStringOrBlank(props, 'published')
    if (!createdAt) {
        return ''
    }

    const { year, month, day } = getDateParts(createdAt)

    return `/${year}/${month}/${day}/${slug}`
}

function findStringContent(items: unknown[]): string {
    for (let item of items) {
        if (typeof item === 'string' && item.length > 0) {
            return item
        }
    }
    return ""
}

function findHtmlContent(items: unknown[]): string {
    for (let item of items) {
        if (typeof item === 'object' && item !== null && 'html' in item) {
            const html = (item as any).html
            if (typeof html === 'string' && html.length > 0) {
                return html
            }
        }
    }
    return ""
}

export function extractPostContent(props: Mf2ObjectProperties): string {
    if (props.content && props.content.length > 0) {
        const stringContent = findStringContent(props.content)
        if (stringContent) return stringContent
        return findHtmlContent(props.content)
    }

    if (props.summary && props.summary.length > 0) {
        return findStringContent(props.summary)
    }

    return ""
}

export function extractPostName(props: Mf2ObjectProperties): string {
    if (props.name) {
        return findStringContent(props.name)
    }

    return ""
}

