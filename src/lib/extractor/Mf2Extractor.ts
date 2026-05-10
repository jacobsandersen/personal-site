import { Mf2ObjectProperties } from "~/content.config";
import { extractDates, ExtractedDates } from "../../util/dates";
import { normalizePostContent, Post, Content } from "../content";

export default abstract class Mf2Extractor {
    protected readonly props: Mf2ObjectProperties
    private readonly dates: ExtractedDates

    constructor(props: Mf2ObjectProperties) {
        this.props = props
        this.dates = extractDates(props)
    }

    getProperties(): Mf2ObjectProperties {
        return this.props
    }

    getRootElem(): string {
        return 'div'
    }

    abstract getTitle(): string;

    getMinimalTitle(): string { 
        return this.getTitle()
    }

    getTitleClasses(): string[] {
        return []
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

    abstract getPost(): Promise<Post>;

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
