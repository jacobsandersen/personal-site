import { Mf2ObjectProperties } from "./mf2";

export interface WebmentionCountsDto {
  total: number,
  reply: number,
  like: number,
  repost: number,
  bookmark: number,
  rsvp: number,
  mention: number
}

export enum WebmentionInteraction {
  REPLY = "reply",
  LIKE = "like",
  REPOST = "repost",
  BOOKMARK = "bookmark",
  RSVP = "rsvp",
  MENTION = "mention"
}

export interface WebmentionDto {
  sourceUrl: string,
  targetUrl: string,
  interaction: WebmentionInteraction,
  authorName?: string,
  authorUrl?: string,
  authorPhoto?: string,
  contentText: string[],
  contentHtml: string[],
  firstSeenAt: string,
  verifiedAt: string
}

export interface SyndicationDto {
  uid: string,
  name: string,
  url: string
}

export enum PostMf2Type {
  ENTRY = "entry",
  CARD = "card",
  FEED = "feed",
  EVENT = "event",
  CITE = "cite",
  REVIEW = "review",
  PRODUCT = "product",
  ITEM = "item",
  RECIPE = "recipe"
}

export enum PostType {
  NOTE = "note",
  ARTICLE = "article",
  REPLY = "reply",
  REPOST = "repost",
  LIKE = "like",
  VIDEO = "video",
  PHOTO = "photo",
  RSVP = "rsvp",
  BOOKMARK = "bookmark",
  CHECKIN = "checkin",
  MOOD = "mood",
}

export interface PostDto {
  id: string,
  slug: string,
  url: string,
  h: string,
  type?: string,
  published: string,
  updated: string,
  name?: string,
  summary: string[],
  content: string[],
  contentHtml: string[],
  category: string[],
  properties: Mf2ObjectProperties,
  webmentionCounts: WebmentionCountsDto,
  webmentions?: WebmentionDto[],
  syndications?: SyndicationDto[]
}

export interface PostGoneDto {
  __type: 'PostGone',
  slug: string,
  url: string,
  published: string 
}

export function isPostGone(obj: any): obj is PostGoneDto {
  return (
    typeof obj === 'object' && obj !== null && '__type' in obj && obj['__type'] === 'PostGone'
  )
}

export interface BastionPagination {
  limit: number,
  offset: number,
  count: number,
  hasMore: boolean
}

export interface BastionPageInfo {
  current: number,
  total: number
}

export interface FeedDto {
  items: PostDto[],
  pagination: BastionPagination
}

export interface TagDto {
  tag: string,
  count: number
}

export interface TagListDto {
  tags: TagDto[],
  pagination: BastionPagination
}