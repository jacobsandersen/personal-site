import { BastionPageInfo, BastionPagination, FeedDto, PostDto, PostGoneDto, PostMf2Type, PostType, TagListDto } from '~/types/bastion';
import { env } from '../env';
import { bastionRequestDuration, bastionRequestsTotal } from '../metrics';

export function determinePageInfo(pagination: BastionPagination): BastionPageInfo {
  const { count, offset, limit } = pagination

  let current = Math.floor(offset / limit) + 1
  let total = Math.ceil(count / limit)

  return { current, total }
}

function getLimitOffset(page: number = 1, perPage: number = 10): { limit: number, offset: number } {
  if (page < 1) page = 1
  let limit = perPage
  let offset = (page - 1) * limit

  return { limit, offset }
}

function buildBastionUrl(route: string): URL {
  return new URL(`${env.BASTION_URL}/${route}`)
}

async function doFetch(url: URL): Promise<Response> {
  const path = url.pathname

  const end = bastionRequestDuration.startTimer({ path })

  const resp = await fetch(url)

  bastionRequestsTotal.inc({ path, status: resp.status })
  end()

  return resp
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
  private _hs: PostMf2Type[]
  private _types: PostType[]
  private _tags: string[]
  private _untagged: boolean
  private _perPage: number
  private _page: number
  private _year: number|null
  private _month: number|null
  private _day: number|null

  constructor() {
    this._hs = []
    this._types = []
    this._tags = []
    this._untagged = false
    this._perPage = 10
    this._page = 1
    this._year = null
    this._month = null
    this._day = null
  }

  h(h: PostMf2Type): BastionFeedClient {
    this._hs.push(h)
    return this
  }

  type(type: PostType): BastionFeedClient {
    this._types.push(type)
    return this
  }

  tag(tag: string): BastionFeedClient {
    this._tags.push(tag)
    return this
  }

  untagged(): BastionFeedClient {
    this._untagged = true
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
    url.searchParams.set("h", this._hs.join(","))
    url.searchParams.set("type", this._types.join(","))
    if (this._untagged) this._tags.push('none')
    url.searchParams.set("tag", this._tags.join(","))
    url.searchParams.set("limit", limit.toString())
    url.searchParams.set("offset", offset.toString())
    if (this._year) url.searchParams.set("year", this._year.toString())
    if (this._month) url.searchParams.set("month", this._month.toString())
    if (this._day) url.searchParams.set("day", this._day.toString())

    const resp = await doFetch(url)
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

    const resp = await doFetch(url)
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

    const resp = await doFetch(url)
    if (!resp.ok) {
      throw new Error(`Bastion tag query failed: ${resp.status} ${resp.statusText}`)
    }

    const json = await resp.json()
    return json as TagListDto
  }
}

const DefaultBastionClient = new BastionClient()
export default DefaultBastionClient