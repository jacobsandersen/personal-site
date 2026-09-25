import { isValidUrl } from "./url"
import { getDateParts } from "./dates"
import type { Mf2ObjectProperties } from "~/types/mf2"

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
