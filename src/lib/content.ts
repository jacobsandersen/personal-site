export type RsvpType = 'yes' | 'no' | 'maybe' | 'interested'

export type Subtype = 'note' | 'article' | 'reply' | 'repost' | 'like' | 'video' | 'photo' | 'rsvp'

export type TertiaryType = 'bookmark' | 'checkin' | 'mood'

// Legacy discriminated Post union - deprecated, kept for fragment compat until removed
export type PostType = 'rsvp' | 'repost' | 'like' | 'reply' | 'bookmark' | 'photo' | 'checkin' | 'note' | 'article' | 'mood'
export type Post = Article | Checkin | Like | Note | Photo | Reply | Repost | Rsvp | Bookmark | Mood

export interface Article {
    type: 'article',
    content: string[]
}

export interface Checkin {
    type: 'checkin'
    latitude: number,
    longitude: number,
    name: string,
    content: string[]
}

export interface CheckinData {
    latitude: number,
    longitude: number,
    name: string
}

export interface Like {
    type: 'like',
    likeOf: string,
    content: string[]
}

export interface Note {
    type: 'note',
    content: string[]
}

export interface Photo {
    type: 'photo',
    photoUrls: string[],
    content: string[]
}

export interface Reply {
    type: 'reply',
    inReplyTo: string,
    content: string[]
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
    content: string[]
}

export interface Mood {
    type: 'mood',
    mood: string,
    content: string[]
}
