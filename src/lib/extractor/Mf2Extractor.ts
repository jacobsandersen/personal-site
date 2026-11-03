import { PostDto, PostType, SyndicationDto, WebmentionCountsDto, WebmentionDto, WebmentionInteraction } from "~/types/bastion";
import { Mf2ObjectProperties } from "~/types/mf2";
import { isValidUrl } from "~/util/url";
import { extractDates, ExtractedDates } from "~/util/dates";
import { CheckinData } from "../content";

const KNOWN_TYPES = new Set<string>(Object.values(PostType))

export default class Mf2Extractor {
    protected readonly doc: PostDto
    private readonly dates: ExtractedDates
    private resolvedType?: PostType

    constructor(doc: PostDto) {
        this.doc = doc
        // Bastion already extracts published/updated from props, so use doc fields directly
        this.dates = extractDates(doc.published ?? "", doc.updated ?? "")
    }

    // --- core accessors ---

    /**
     * Resolves the post type. Uses Bastion's type hint when it is a known type,
     * otherwise infers it from properties using the same ordered rules Bastion
     * uses for discovery. Never throws.
     */
    getType(): PostType {
        if (!this.resolvedType) {
            const hint = this.doc.type as PostType | undefined
            this.resolvedType = hint && KNOWN_TYPES.has(hint) ? hint : this.inferType()
        }

        return this.resolvedType
    }

    private inferType(): PostType {
        const props = this.getProperties()
        const has = (name: string) => (props[name] ?? []).length > 0

        if (this.getRsvp()) return PostType.RSVP
        if (this.getInReplyTo()) return PostType.REPLY
        if (this.getRepostOf()) return PostType.REPOST
        if (this.getLikeOf()) return PostType.LIKE
        if (this.getVideoUrls().length > 0) return PostType.VIDEO
        if (this.getPhotoUrls().length > 0) return PostType.PHOTO
        if (this.getBookmarkOf()) return PostType.BOOKMARK
        if (has('checkin') && this.getCheckin()) return PostType.CHECKIN
        if (this.getMood()) return PostType.MOOD

        const name = this.getName()?.trim()
        const body = [...this.doc.content, ...this.doc.summary].find(v => v.trim().length > 0)?.trim()
        if (name && body && !body.startsWith(name)) return PostType.ARTICLE

        return PostType.NOTE
    }

    getProperties(): Mf2ObjectProperties {
        return this.doc.properties
    }

    getSummary(): string[] {
      return this.doc.summary
    }

    get isHtml(): boolean {
        return this.doc.contentHtml.length > 0
    }

    getContent(): string[] {
        return this.isHtml ? this.doc.contentHtml : this.doc.content
    }

    getSyndications(): SyndicationDto[] {
      return this.doc.syndications ?? []
    }

    getWebmentionCounts(): WebmentionCountsDto {
      return this.doc.webmentionCounts
    }

    getWebmentions(): WebmentionDto[] {
      // Bastion serializes the interaction as its enum name ("REPLY"); normalize
      // so comparisons against WebmentionInteraction hold either way.
      return (this.doc.webmentions ?? []).map((wm) => ({
        ...wm,
        interaction: String(wm.interaction).toLowerCase() as WebmentionInteraction,
      }))
    }
    
    getUrl(): string | undefined {
      return this.doc.url
    }

    /** In-site path of the permalink (works behind the reverse proxy). */
    getPermalinkPath(): string | undefined {
      const url = this.doc.url
      if (!url || !isValidUrl(url)) return undefined
      return new URL(url).pathname
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

    // --- title & headline ---

    /**
     * The real title (Bastion `name`), for any post type: micropub clients can
     * send one with a photo, bookmark, etc. Drives `p-name`. A name that merely
     * repeats the start of the body is mf2's implied name, not a title.
     */
    getTitle(): string | null {
        const name = this.getName()?.trim()
        if (!name) return null
        if (this.getType() === PostType.ARTICLE) return name

        const body = [...this.doc.content, ...this.doc.summary].find(v => v.trim().length > 0)?.trim()
        return body && body.startsWith(name) ? null : name
    }

    /**
     * Headline shown on every post. Only a real title is flagged `isTitle`,
     * so callers can apply `p-name` to titles and never to action sentences.
     */
    getHeadline(): { text: string, isTitle: boolean } {
        const title = this.getTitle()
        if (title) return { text: title, isTitle: true }

        return { text: this.getActionSentence(), isTitle: false }
    }

    private getActionSentence(): string {
        switch (this.getType()) {
            case PostType.REPLY: return 'Replied to a post'
            case PostType.REPOST: return 'Reposted a link'
            case PostType.LIKE: return 'Liked a link'
            case PostType.BOOKMARK: return 'Bookmarked a link'
            case PostType.RSVP: {
                const rsvp = this.getRsvp()
                return rsvp ? `RSVPed ${rsvp}` : 'RSVPed to an event'
            }
            case PostType.PHOTO: {
                const count = this.getPhotos().length
                return count > 1 ? `Shared ${count} photos` : 'Shared a photo'
            }
            case PostType.VIDEO: {
                const count = this.getVideoUrls().length
                return count > 1 ? `Shared ${count} videos` : 'Shared a video'
            }
            case PostType.MOOD: {
                const mood = this.getMood()
                return mood ? `Feeling ${mood}` : 'Logged a mood'
            }
            case PostType.CHECKIN: {
                const checkin = this.getCheckin()
                return checkin ? `Checked in at ${checkin.name}` : 'Checked in'
            }
            default: return 'Posted a note'
        }
    }

    // --- webmention counts ---

    /** Comments are replies and mentions. */
    getCommentCount(): number {
        const counts = this.getWebmentionCounts()
        return counts.reply + counts.mention
    }

    getReactionCounts(): { like: number, repost: number, bookmark: number, rsvp: number } {
        const { like, repost, bookmark, rsvp } = this.getWebmentionCounts()
        return { like, repost, bookmark, rsvp }
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
        return this.getPhotos().map(photo => photo.url)
    }

    getPhotos(): { url: string, alt?: string }[] {
        const photos = this.getProperties().photo ?? []
        return photos.flatMap(photo => {
            if (typeof photo === 'string') {
                return isValidUrl(photo) ? [{ url: photo }] : []
            }
            if (photo && typeof photo === 'object' && typeof (photo as any).value === 'string' && isValidUrl((photo as any).value)) {
                const alt = (photo as any).alt
                return [{ url: (photo as any).value as string, alt: typeof alt === 'string' ? alt : undefined }]
            }
            return []
        })
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

    // --- helpers ---

    private getValidUrlProp(propName: string): string | null {
        const vals = this.getProperties()[propName]
        if (!vals || vals.length === 0) return null
        const url = vals[0]
        if (typeof url !== 'string' || url.length === 0 || !isValidUrl(url)) return null
        return url
    }

    // keep for backwards compat if any code calls getPost; now returns trait bag
    async getPost(): Promise<Record<string, unknown>> {
        return {
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
        }
    }
}
