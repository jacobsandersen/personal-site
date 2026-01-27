import dayjs from 'dayjs'
import { Mf2Properties } from '~/types/mf2-document';
import { getFirstStringOrBlank } from './mf2-util';

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
    const parsed = dayjs(rawDate)
    const display = parsed.isValid() ? parsed.format('MMMM D, YYYY') : ''
    const displayTime = parsed.isValid() ? parsed.format('HH:mm') : ''
    return [parsed, display, displayTime]
}

export function extractDates(props: Mf2Properties): ExtractedDates {
    const createdAtRaw = getFirstStringOrBlank(props, 'created-at')
    const createdAtComponents = getParsedAndDisplay(createdAtRaw)
    const updatedAtRaw = getFirstStringOrBlank(props, 'updated-at')
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