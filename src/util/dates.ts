import dayjs from 'dayjs'
import { Mf2Properties } from '~/types/mf2-document';
import { getFirstStringOrBlank } from './mf2-util';

export interface ExtractedDates {
    createdAtRaw: string,
    createdAtParsed: dayjs.Dayjs,
    createdAtDisplay: string,
    createdAtDisplayTime: string,
    createdAtShort(): string,
    createdAtFull(): string,
    updatedAtRaw: string,
    updatedAtParsed: dayjs.Dayjs,
    updatedAtDisplay: string,
    updatedAtDisplayTime: string,
    updatedAtShort(): string,
    updatedAtFull(): string,
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
        createdAtShort() {
            return this.createdAtDisplay
        },
        createdAtFull() {
            return `${this.createdAtDisplayTime} ${this.createdAtDisplay}`
        },
        updatedAtRaw,
        updatedAtParsed: updatedAtComponents[0],
        updatedAtDisplay: updatedAtComponents[1],
        updatedAtDisplayTime: updatedAtComponents[2],
        updatedAtShort() {
            return this.updatedAtParsed.isSame(this.createdAtParsed) ? '' : this.updatedAtDisplay
        },
        updatedAtFull() {
            return this.updatedAtParsed.isSame(this.createdAtParsed) ? '' : `${this.updatedAtDisplayTime} ${this.updatedAtDisplay}`
        }
    }
}