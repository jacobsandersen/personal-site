export type Html = { html: string }

export type Content = string | Html 

export type RsvpType = 'yes' | 'no' | 'maybe' | 'interested'

export type PostType = 'rsvp' | 'repost' | 'like' | 'reply' | 'bookmark' | 'photo' | 'checkin' | 'note' | 'article' | 'mood'

export type Post = Article | Checkin | Like | Note | Photo | Reply | Repost | Rsvp | Bookmark | Mood

export interface Article {
    type: 'article',
    content: Content[]
}

export interface Checkin {
    type: 'checkin'
    latitude: number,
    longitude: number,
    name: string,
    content: Content[]
}

export interface Like {
    type: 'like',
    likeOf: string,
    content: Content[]
}

export interface Note {
    type: 'note',
    content: Content[]
}

export interface Photo {
    type: 'photo',
    photoUrls: string[],
    content: Content[]
}

export interface Reply {
    type: 'reply',
    inReplyTo: string,
    content: Content[]
}

export interface Repost {
    type: 'repost',
    repostOf: string
}

export interface Rsvp {
    type: 'rsvp',
    inReplyTo: string,
    event: string,
    rsvp: string
}

export interface Bookmark {
    type: 'bookmark',
    bookmarkOf: string,
    content: Content[]
}

export interface Mood {
    type: 'mood',
    mood: string,
    content: Content[]
}

export function isString(v: unknown): v is string {
    return typeof v === 'string'
}

export function isHtml(v: unknown): v is Html {
    return typeof v === 'object' 
        && v !== null 
        && 'html' in v 
        && isString((v as any).html)
}

export function normalizePostContent(content: unknown[]): Content[] {
    return content.filter(item => isString(item) || isHtml(item))
}