import dayjs from "dayjs";
import { env } from "~/lib/env";
import { createHEntryExtractor, type Mf2Extractor } from "~/lib/extractor";
import type { FeedDefinition } from "~/lib/feeds";
import type { PostDto } from "~/types/bastion";

const AUTHOR_NAME = "Jacob Andersen"
const WEBSUB_HUB = "https://pubsubhubbub.superfeedr.com/"
const ENTRY_LIMIT = 20

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function absolute(path: string): string {
  return `${env.PUBLIC_URL.replace(/\/$/, "")}${path}`
}

function toRfc3339(raw: string | undefined): string | null {
  if (!raw) return null
  const parsed = dayjs(raw)
  return parsed.isValid() ? parsed.toISOString() : null
}

function linkLine(label: string, url: string): string {
  return `<p>${label} <a href="${escapeXml(url)}">${escapeXml(url)}</a></p>`
}

/**
 * Builds the entry body. Many post types keep their substance in properties
 * (photo, like-of, ...) rather than in `content`, so feed readers would show
 * only a title. Media and link targets are rendered as plain, class-free HTML
 * (readers cannot run the site's components). Moods, check-ins and RSVPs are
 * already fully described by the entry title. Media URLs are stored absolute
 * (CF R2), so they are used as-is.
 */
function renderContent(extractor: Mf2Extractor): { type: "html" | "text", value: string } | null {
  const parts: string[] = []

  const targets: [string, string | null][] = [
    ["Replied to", extractor.getInReplyTo()],
    ["Reposted", extractor.getRepostOf()],
    ["Liked", extractor.getLikeOf()],
    ["Bookmarked", extractor.getBookmarkOf()],
  ]
  for (const [label, url] of targets) {
    if (url) parts.push(linkLine(label, url))
  }

  for (const photo of extractor.getPhotos()) {
    parts.push(`<p><img src="${escapeXml(photo.url)}" alt="${escapeXml(photo.alt ?? "")}"/></p>`)
  }

  for (const url of extractor.getVideoUrls()) {
    parts.push(`<p><video controls="controls" src="${escapeXml(url)}"><a href="${escapeXml(url)}">Watch video</a></video></p>`)
  }

  const body = extractor.getContent().join("").trim()
  if (parts.length === 0) {
    return body ? { type: extractor.isHtml ? "html" : "text", value: body } : null
  }

  if (body) parts.push(extractor.isHtml ? body : `<p>${escapeXml(body)}</p>`)
  return { type: "html", value: parts.join("\n") }
}

function renderEntry(post: PostDto): string | null {
  // Atom requires a stable id and permalink; skip posts we cannot address.
  if (post.h !== "h-entry") return null
  const extractor = createHEntryExtractor(post)
  const permalinkPath = extractor.getPermalinkPath()
  if (!permalinkPath) return null

  const permalink = absolute(permalinkPath)
  const published = toRfc3339(post.published)
  const updated = toRfc3339(post.updated) ?? published ?? new Date().toISOString()

  const lines = [
    "  <entry>",
    `    <id>${escapeXml(permalink)}</id>`,
    `    <title>${escapeXml(extractor.getHeadline().text)}</title>`,
    `    <link rel="alternate" type="text/html" href="${escapeXml(permalink)}"/>`,
  ]

  if (published) lines.push(`    <published>${published}</published>`)
  lines.push(`    <updated>${updated}</updated>`)

  for (const category of extractor.getCategories()) {
    lines.push(`    <category term="${escapeXml(category)}"/>`)
  }

  const summary = extractor.getSummary().join(" ").trim()
  if (summary) lines.push(`    <summary type="text">${escapeXml(summary)}</summary>`)

  const content = renderContent(extractor)
  if (content) {
    lines.push(`    <content type="${content.type}">${escapeXml(content.value)}</content>`)
  }

  lines.push("  </entry>")
  return lines.join("\n")
}

export function renderAtom(feed: FeedDefinition, posts: PostDto[]): string {
  const feedUrl = absolute(feed.atomPath)
  const htmlUrl = absolute(feed.path)

  const entries = posts.map(renderEntry).filter((entry): entry is string => entry !== null)

  const newest = posts
    .map((post) => toRfc3339(post.updated) ?? toRfc3339(post.published))
    .filter((value): value is string => value !== null)
    .sort()
    .at(-1)

  return [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom">`,
    `  <id>${escapeXml(htmlUrl)}</id>`,
    `  <title>${escapeXml(`${feed.title} - ${AUTHOR_NAME}`)}</title>`,
    `  <updated>${newest ?? new Date().toISOString()}</updated>`,
    `  <author><name>${escapeXml(AUTHOR_NAME)}</name><uri>${escapeXml(absolute("/"))}</uri></author>`,
    `  <link rel="self" type="application/atom+xml" href="${escapeXml(feedUrl)}"/>`,
    `  <link rel="alternate" type="text/html" href="${escapeXml(htmlUrl)}"/>`,
    `  <link rel="hub" href="${WEBSUB_HUB}"/>`,
    ...entries,
    `</feed>`,
    ``,
  ].join("\n")
}

/** Builds the Atom response for a feed: the newest {@link ENTRY_LIMIT} entries, full content. */
export async function atomResponse(feed: FeedDefinition): Promise<Response> {
  try {
    const result = await feed.build().perPage(ENTRY_LIMIT).page(1).query()

    return new Response(renderAtom(feed, result.items), {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch (error) {
    console.error(`Failed to build atom feed ${feed.atomPath}`, error)
    return new Response("Unable to build feed right now", { status: 502 })
  }
}

export function badRequest(message: string): Response {
  return new Response(message, { status: 400 })
}
