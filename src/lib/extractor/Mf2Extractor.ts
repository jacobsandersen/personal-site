import { PostDto } from "~/types/bastion";
import { Mf2ObjectProperties } from "~/types/mf2";
import { isValidUrl } from "~/util/url";
import { extractDates, ExtractedDates } from "~/util/dates";
import { CheckinData } from "../content";

export interface HEntryHint {
    subtype: string;
    tertiaryType: string | null;
}

export default class Mf2Extractor {
    protected readonly doc: PostDto
    private readonly dates: ExtractedDates

    constructor(doc: PostDto) {
        this.doc = doc
        // Bastion already extracts published/updated from props, so use doc fields directly
        this.dates = extractDates(doc.published ?? "", doc.updated ?? "")
    }

    // --- core accessors ---

    getProperties(): Mf2ObjectProperties {
        return this.doc.properties
    }

    getRootElem(): string {
        if (this.getHint().subtype === 'article') {
            return 'article'
        }
        return 'div'
    }

    getHint(): HEntryHint {
        // HEntry.astro is only instantiated when doc.type === 'h-entry',
        // so subtype is never null. tertiaryType is only non-null when subtype === 'note'.
        const subtype = this.doc.subtype as string
        const tertiaryType = (this.doc.tertiaryType ?? null) as string | null
        return { subtype, tertiaryType }
    }

    getSummary(): string[] {
      return this.doc.summary
    }

    getContent(): string[] {
        if (this.doc.contentHtml.length) {
          return this.doc.contentHtml
        } else if (this.doc.content.length) {
          return this.doc.content
        } else if (this.doc.summary.length) {
          return this.doc.summary
        }

        return []
    }

    getUrl(): string | undefined {
      return this.doc.url
    }

    getCategories(): string[] {
        return this.doc.category
    }

    getHashtags(): string[] {
        return this.getCategories().map(cat => `#${cat}`)
    }

    getPublished(): string | undefined {
      return this.doc.published
    }

    getUpdated(): string | undefined {
      return this.doc.updated
    }

    getDates(): ExtractedDates {
        return this.dates
    }

    getFirstString(propName: string): string | null {
      return this.getFirstPropertyOrDefault<null>(propName, null)
    }

    getFirstStringOrBlank(propertyName: string): string {
        return this.getFirstPropertyOrDefault<string>(propertyName, "")
    }

    getFirstPropertyOrDefault<T>(propertyName: string, defaultValue: T): T {
        const values = this.getProperties()[propertyName]
        if (values && values.length > 0) {
            return values[0] as T
        }

        return defaultValue
    }

    hasPropWithValidUrl(propName: string): boolean {
        const values = this.getProperties()[propName]
        if (!values || values.length === 0) {
            return false
        }

        const propValue = values[0]
        return typeof propValue === 'string' && isValidUrl(propValue)
    }

    getName(): string | null {
        // Prefer doc.name if present, else properties['name']
        if (this.doc.name && this.doc.name.length > 0) {
            return this.doc.name
        }
        return this.getFirstString('name')
    }

    // --- title helpers ---

    getTitle(): string {
        const hint = this.getHint()
        switch (hint.subtype) {
            case 'article':
                return this.getName() ?? 'Untitled Article'
            case 'reply': {
                const target = this.getInReplyTo()
                return target ? `Replied to ${this.abbrevUrl(target)}` : 'Replied to a post'
            }
            case 'repost': {
                const target = this.getRepostOf()
                return target ? `Reposted ${this.abbrevUrl(target)}` : 'Reposted a post'
            }
            case 'like': {
                const target = this.getLikeOf()
                return target ? `Liked ${this.abbrevUrl(target)}` : 'Liked a post'
            }
            case 'video': {
                const count = this.getVideoUrls().length
                if (count === 0) return 'Posted a video'
                return `Posted ${count === 1 ? 'a' : count} ${count === 1 ? 'video' : 'videos'}`
            }
            case 'photo': {
                const count = this.getPhotoUrls().length
                if (count === 0) return 'Posted a photo'
                const label = count === 1 ? 'photo' : 'photos'
                return `Posted ${count === 1 ? 'a' : count} ${label}`
            }
            case 'rsvp':
                return `RSVP for ${this.getRsvpEvent() ?? this.abbrevUrl(this.getInReplyTo() ?? 'an event')}`
            case 'note': {
                switch (hint.tertiaryType) {
                    case 'bookmark': {
                        const target = this.getBookmarkOf()
                        return target ? `Bookmarked ${this.abbrevUrl(target)}` : 'Bookmarked a post'
                    }
                    case 'checkin': {
                        const checkin = this.getCheckin()
                        return checkin ? `Checked in at ${checkin.name}` : 'Checked in'
                    }
                    case 'mood': {
                        const mood = this.getMood()
                        return mood ? `Logged his mood as "${mood}"` : 'Logged his mood'
                    }
                    default:
                        return 'Posted a note'
                }
            }
            default:
                return this.getName() ?? `Posted a ${hint.subtype}`
        }
    }

    getMinimalTitle(): string {
        const hint = this.getHint()
        if (hint.subtype === 'rsvp') {
            const rsvp = this.getRsvp()
            const abbrev = this.abbrevUrl(this.getInReplyTo() ?? '')
            if (rsvp) {
                return `${rsvp[0].toUpperCase() + rsvp.slice(1)}: ${abbrev}`
            }
            return abbrev
        }
        if (hint.subtype === 'note' && hint.tertiaryType === 'mood') {
            return 'Logged his mood'
        }
        return this.getTitle()
    }

    getTitleClasses(): string[] {
        if (this.getHint().subtype === 'article') {
            return ['p-name']
        }
        return []
    }

    // --- trait getters (nullable, never throw) ---

    getLikeOf(): string | null {
        return this.getValidUrlProp('like-of')
    }

    getRepostOf(): string | null {
        return this.getValidUrlProp('repost-of')
    }

    getInReplyTo(): string | null {
        return this.getValidUrlProp('in-reply-to')
    }

    getBookmarkOf(): string | null {
        return this.getValidUrlProp('bookmark-of')
    }

    getPhotoUrls(): string[] {
        const photos = this.getProperties().photo
        if (!photos || photos.length === 0) return []
        return photos.filter(url => typeof url === 'string' && isValidUrl(url)) as string[]
    }

    getVideoUrls(): string[] {
        const videos = this.getProperties()['video']
        if (!videos || videos.length === 0) return []
        return videos.filter(url => typeof url === 'string' && isValidUrl(url)) as string[]
    }

    getCheckin(): CheckinData | null {
        const checkin = this.getProperties().checkin
        if (!checkin || checkin.length === 0) return null
        const raw = (checkin as any[])[0]
        const checkinProps = raw?.properties
        if (!checkinProps?.latitude?.length || !checkinProps?.longitude?.length) return null
        const latitude = Number.parseFloat(checkinProps.latitude[0])
        const longitude = Number.parseFloat(checkinProps.longitude[0])
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null
        const name = checkinProps.name?.[0] ?? "Unknown location"
        return { latitude, longitude, name }
    }

    getMood(): string | null {
        const mood = this.getProperties().mood
        if (!mood || mood.length === 0) return null
        const val = mood[0]
        return typeof val === 'string' && val.length > 0 ? val : null
    }

    getRsvp(): string | null {
        const vals = this.getProperties().rsvp
        if (!vals || vals.length === 0) return null
        const v = vals[0]
        return typeof v === 'string' && v.length > 0 ? v : null
    }

    getRsvpEvent(): string | null {
        // Original RsvpMf2Extractor read properties.content for event name
        const vals = this.getProperties().content
        if (!vals || vals.length === 0) return null
        const v = vals[0]
        return typeof v === 'string' && v.length > 0 ? v : null
    }

    // --- helpers ---

    private getValidUrlProp(propName: string): string | null {
        const vals = this.getProperties()[propName]
        if (!vals || vals.length === 0) return null
        const url = vals[0]
        if (typeof url !== 'string' || url.length === 0 || !isValidUrl(url)) return null
        return url
    }

    private abbrevUrl(url: string): string {
        const maxLen = 36
        if (url.length <= maxLen) return url
        return `${url.slice(0, maxLen)}...`
    }

    // keep for backwards compat if any code calls getPost; now returns trait bag
    async getPost(): Promise<Record<string, unknown>> {
        return {
            hint: this.getHint(),
            content: this.getContent(),
            likeOf: this.getLikeOf(),
            repostOf: this.getRepostOf(),
            inReplyTo: this.getInReplyTo(),
            bookmarkOf: this.getBookmarkOf(),
            photoUrls: this.getPhotoUrls(),
            videoUrls: this.getVideoUrls(),
            checkin: this.getCheckin(),
            mood: this.getMood(),
            rsvp: this.getRsvp(),
            event: this.getRsvpEvent(),
        }
    }
}
