import { Mf2Properties } from "~/types/mf2-document";
import { extractDates, ExtractedDates } from "../../util/dates";
import { normalizePostContent, Post, Content } from "../content";

export default abstract class Mf2Extractor {
    protected readonly props: Mf2Properties
    private readonly dates: ExtractedDates

    constructor(props: Mf2Properties) {
        this.props = props
        this.dates = extractDates(props)
    }

    getRootElem(): string {
        return 'div'
    }

    abstract getTitle(): string;

    getTitleClasses(): string[] {
        return []
    }

    isCompactPreview(): boolean {
        return false
    }

    getSummary(): string {
        for (const summary of this.props.summary ?? []) {
            if (typeof summary === 'string') {
                return summary
            }
        }

        return ''
    }

    getParsedContentProp(): Content[] {
        const contentProp = this.props.content
        if (!contentProp || contentProp.length === 0) {
            return []
        }

        return normalizePostContent(contentProp)
    }

    abstract getPost(cache?: KVNamespace<string>): Promise<Post>;

    getCategories(): string[] {
        return this.props.category ? (this.props.category as string[]) : []
    }

    getHashtags(): string[] {
        return this.getCategories().map(cat => `#${cat}`)
    }

    getDates(): ExtractedDates {
        return this.dates
    }
    
    getLongCreatedAt(): string {
        return `at ${this.dates.createdAtDisplayTime} on ${this.dates.createdAtDisplay}`
    }
    
    getLongCreatedFrom(): string {
        return `from ${this.dates.createdAtDisplay} at ${this.dates.createdAtDisplayTime}`
    }

    getFirstString(propName: string): string | null {
        for (const prop of this.props[propName] ?? []) {
            if (typeof prop === 'string') {
                return prop
            }
        }

        return null
    }
}
