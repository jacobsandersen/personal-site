import DefaultBastionClient, { type BastionFeedClient } from "~/lib/bastion";
import { PostMf2Type, PostType } from "~/types/bastion";

/**
 * A single source of truth for "what is in this feed". Both the h-feed page
 * and its Atom twin are built from the same definition so they cannot drift.
 */
export interface FeedDefinition {
  /** Human readable feed title. */
  title: string
  /** Site-relative path of the h-feed page, without a trailing slash ("/" for the index). */
  path: string
  /** Site-relative path of the Atom feed. */
  atomPath: string
  /** A Bastion query already filtered to this feed's entries. */
  build(): BastionFeedClient
}

function define(
  title: string,
  path: string,
  filter: (client: BastionFeedClient) => BastionFeedClient = (client) => client,
): FeedDefinition {
  return {
    title,
    path,
    atomPath: `${path === "/" ? "" : path}/index.xml`,
    build: () => filter(DefaultBastionClient.posts().h(PostMf2Type.ENTRY)),
  }
}

const TYPE_FEEDS: Partial<Record<PostType, { slug: string, title: string }>> = {
  [PostType.ARTICLE]: { slug: "articles", title: "Articles" },
  [PostType.BOOKMARK]: { slug: "bookmarks", title: "Bookmarks" },
  [PostType.LIKE]: { slug: "likes", title: "Likes" },
  [PostType.MOOD]: { slug: "mood", title: "Mood Log" },
  [PostType.NOTE]: { slug: "notes", title: "Notes" },
  [PostType.REPLY]: { slug: "replies", title: "Replies" },
  [PostType.REPOST]: { slug: "reposts", title: "Reposts" },
}

export function indexFeed(): FeedDefinition {
  return define("Recent Posts", "/")
}

export function typeFeed(type: PostType): FeedDefinition {
  const config = TYPE_FEEDS[type]
  if (!config) {
    throw new Error(`No feed is defined for post type "${type}"`)
  }

  return define(config.title, `/${config.slug}`, (client) => client.type(type))
}

export function uncategorizedFeed(): FeedDefinition {
  return define("Uncategorized Posts", "/uncategorized", (client) => client.untagged())
}

export function tagFeed(tag: string): FeedDefinition {
  return define(`Posts tagged with #${tag}`, `/tagged/${encodeURIComponent(tag)}`, (client) => client.tag(tag))
}

export function yearFeed(year: number): FeedDefinition {
  return define(`Posts from ${year}`, `/${year}`, (client) => client.year(year))
}

/** Parses a `[year]` route param; returns null unless it is exactly four digits. */
export function parseYear(param: string | undefined): number | null {
  return param && /^\d{4}$/.test(param) ? Number.parseInt(param, 10) : null
}
