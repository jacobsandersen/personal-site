import { FeedDto, NoteType, PostDto, PostGoneDto, PostMf2Type, PostType, TagListDto } from '~/types/bastion';
import { env } from '../env';

function getLimitOffset(page: number = 1, perPage: number = 10): { limit: number, offset: number } {
  if (page < 1) page = 1
  let limit = perPage
  let offset = (page - 1) * limit

  return { limit, offset }
}

function buildBastionUrl(route: string): URL {
  return new URL(`${env.BASTION_URL}/${route}`)
}

interface AuthProvider {
  provider: string,
  client_id: string,
  authorize_url: string,
  redirect_uri?: string
}

interface AuthProviderResponse {
  providers: AuthProvider[]
}

export class BastionClient {
  tags(): BastionTagClient {
    return new BastionTagClient()
  }

  posts(): BastionFeedClient {
    return new BastionFeedClient()
  }

  post(): BastionPostClient {
    return new BastionPostClient()
  }

  async loadAuthProviders(): Promise<AuthProviderResponse> {
    const resp = await fetch(buildBastionUrl("indieauth/providers"))
    if (!resp.ok) {
      throw new Error(`loadAuthProviders failed: ${resp.status} ${resp.statusText}`)
    }

    const json = await resp.json()
    return json as AuthProviderResponse
  }
}

class BastionFeedClient {
  private _types: PostMf2Type[]
  private _subtypes: PostType[]
  private _tertiaryTypes: NoteType[]
  private _tags: string[]
  private _perPage: number
  private _page: number
  private _year: number|null
  private _month: number|null
  private _day: number|null

  constructor() {
    this._types = []
    this._subtypes = []
    this._tertiaryTypes = []
    this._tags = []
    this._perPage = 10
    this._page = 1
    this._year = null
    this._month = null
    this._day = null
  }

  type(type: PostMf2Type): BastionFeedClient {
    this._types.push(type)
    return this
  }

  subtype(subtype: PostType): BastionFeedClient {
    this._subtypes.push(subtype)
    return this
  }

  noteType(noteType: NoteType): BastionFeedClient {
    this._tertiaryTypes.push(noteType)
    return this
  }

  tag(tag: string): BastionFeedClient {
    this._tags.push(tag)
    return this
  }

  perPage(perPage: number = 10): BastionFeedClient {
    if (perPage <= 0) {
      perPage = 10
    }

    this._perPage = perPage
    return this
  }

  page(page: number = 1): BastionFeedClient {
    if (page <= 0) {
      page = 1
    }

    this._page = page
    return this
  }

  year(year: number): BastionFeedClient {
    this._year = year
    return this
  }

  month(month: number): BastionFeedClient {
    this._month = month
    return this
  }

  day(day: number): BastionFeedClient {
    this._day = day
    return this
  }

  async query(): Promise<FeedDto> {
    let { limit, offset } = getLimitOffset(this._page, this._perPage)

    let url = buildBastionUrl("api/posts")
    url.searchParams.set("type", this._types.join(","))
    url.searchParams.set("subtype", this._subtypes.join(","))
    url.searchParams.set("tertiaryType", this._tertiaryTypes.join(","))
    url.searchParams.set("tag", this._tags.join(","))
    url.searchParams.set("limit", limit.toString())
    url.searchParams.set("offset", offset.toString())
    if (this._year) url.searchParams.set("year", this._year.toString())
    if (this._month) url.searchParams.set("month", this._month.toString())
    if (this._day) url.searchParams.set("day", this._day.toString())

    const resp = await fetch(url)
    if (!resp.ok) {
      throw new Error(`Bastion feed query failed: ${resp.status} ${resp.statusText}`)
    }

    const json = await resp.json()
    return json as FeedDto
  } 
}

class BastionPostClient {
  private _slug: string|null
  private _url: string|null

  constructor() {
    this._slug = null
    this._url = null 
  }

  url(url: string): BastionPostClient {
    this._url = url
    return this
  }

  slug(slug: string): BastionPostClient {
    this._slug = slug
    return this
  }
  
  async query(): Promise<PostDto|PostGoneDto|null> {
    let url: URL|null = null

    if (this._url) {
      url = buildBastionUrl("api/posts/lookup")
      url.searchParams.set('url', this._url)
    } else if (this._slug) {
      url = buildBastionUrl(`api/posts/${this._slug}`)
    }

    if (!url) {
      throw new Error("Either _url or _slug must specified to query for a Bastion post")
    }

    const resp = await fetch(url)
    if (!resp.ok) {
      if (resp.status === 404) {
        return null
      } else if (resp.status === 410) {
        const json = await resp.json()
        return { '__type': 'PostGone', ...json } as PostGoneDto
      }

      throw new Error(`Post lookup failed: ${resp.status} ${resp.statusText}`)
    }

    const json = await resp.json()
    return { '__type': 'Post', ...json } as PostDto
  }
}

class BastionTagClient {
  private _page: number = 1
  private _perPage: number = 50

  page(page: number): BastionTagClient {
    if (page <= 0) {
      page = 1
    }

    this._page = page
    return this
  }

  perPage(perPage: number): BastionTagClient {
    if (perPage <= 0) {
      perPage = 50
    }

    this._perPage = perPage
    return this
  }

  async query(): Promise<TagListDto> {
    let { limit, offset } = getLimitOffset(this._page, this._perPage)

    let url = buildBastionUrl("api/tags")
    url.searchParams.set('limit', limit.toString())
    url.searchParams.set('offset', offset.toString())

    const resp = await fetch(url)
    if (!resp.ok) {
      throw new Error(`Bastion tag query failed: ${resp.status} ${resp.statusText}`)
    }

    const json = await resp.json()
    return json as TagListDto
  }
}

const DefaultBastionClient = new BastionClient()
export default DefaultBastionClient