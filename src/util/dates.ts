import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Mf2ObjectProperties } from '~/types/mf2'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface ExtractedDates {
    createdAtRaw: string,
    createdAtParsed: dayjs.Dayjs,
    createdAtDisplay: string,
    createdAtDisplayTime: string,
    updatedAtRaw: string,
    updatedAtParsed: dayjs.Dayjs,
    updatedAtDisplay: string,
    updatedAtDisplayTime: string,
    updatedSameAsCreated(): boolean
}

function getParsedAndDisplay(rawDate: string): [dayjs.Dayjs, string, string] {
    const parsed = dayjs(rawDate).tz("Asia/Manila")
    const display = parsed.isValid() ? parsed.format('MMMM D, YYYY') : ''
    const displayTime = parsed.isValid() ? parsed.format('HH:mm') : ''
    return [parsed, display, displayTime]
}

export function parseAdhoc(date: Date, format: string): string {
    const parsed = dayjs(date).tz("Asia/Manila")
    return parsed.isValid() ? parsed.format(format) : ''
}

function getFirstStringOrBlank(props: Mf2ObjectProperties, key: string): string {
    const vals = props[key]
    if (!vals || vals.length === 0) return ""
    const first = vals[0]
    return typeof first === 'string' ? first : ""
}

function buildExtractedDates(createdAtRaw: string, updatedAtRaw: string): ExtractedDates {
    const createdAtComponents = getParsedAndDisplay(createdAtRaw)
    const updatedAtComponents = getParsedAndDisplay(updatedAtRaw)

    return {
        createdAtRaw,
        createdAtParsed: createdAtComponents[0],
        createdAtDisplay: createdAtComponents[1],
        createdAtDisplayTime: createdAtComponents[2],
        updatedAtRaw,
        updatedAtParsed: updatedAtComponents[0],
        updatedAtDisplay: updatedAtComponents[1],
        updatedAtDisplayTime: updatedAtComponents[2],
        updatedSameAsCreated() {
            return this.updatedAtParsed.isSame(this.createdAtParsed)
        }
    }
}

export function extractDates(props: Mf2ObjectProperties): ExtractedDates

export function extractDates(published: string, updated: string): ExtractedDates

export function extractDates(
    arg1: Mf2ObjectProperties | string,
    arg2?: string
): ExtractedDates {
    if (typeof arg1 === 'string') {
        const published = arg1
        const updated = arg2 ?? ""
        return buildExtractedDates(published, updated)
    } else {
        const props = arg1 as Mf2ObjectProperties
        const createdAtRaw = getFirstStringOrBlank(props, 'published')
        const updatedAtRaw = getFirstStringOrBlank(props, 'updated')
        return buildExtractedDates(createdAtRaw, updatedAtRaw)
    }
}

export function getDateParts(date: string) {
  const parsed = dayjs(date).utcOffset(dayjs(date).utcOffset(), true)

  return {
    year: parsed.format('YYYY'),
    month: parsed.format('MM'),
    day: parsed.format('DD')
  }
}
