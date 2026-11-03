import { env } from "./env"
import { seerRequestsTotal, seerRequestDuration } from "./metrics"

interface SeerResp<T> {
  message: string,
  data: T | undefined
}

export interface HardcoverData {
  pagination: {
    current_page: number,
    total_pages: number
  },
  books: HardcoverBook[]
}

export interface HardcoverBook {
  title: string,
  slug: string,
  author: string,
  image: string,
  last_read: string,
  times_read: number
}

export interface NowPlaying {
  name: string,
  artist: {
    "#text": string
  }
}

export async function getPreviousReads(page: number): Promise<HardcoverData | undefined> {
  return request(`hardcover/books?status=read&limit=10&page=${page}`)
}

export async function getWantToRead(page: number): Promise<HardcoverData | undefined> {
  return request(`hardcover/books?status=wanted&limit=10&page=${page}`)
}

/**
 * Resolves to the book currently being read, `null` when the request succeeded
 * but nothing is being read, or `undefined` when the request failed.
 */
export async function getNowReading(): Promise<HardcoverBook | null | undefined> {
  const data = await request<HardcoverData>("hardcover/books?status=current&limit=1")
  if (!data || !data.books) {
    console.error("load current reading fail: no data returned from seer")
    return undefined
  }

  return data.books[0] ?? null
}

export async function getNowPlaying(): Promise<NowPlaying | undefined> {
  return request("lastfm")
}

const REQUEST_TIMEOUT_MS = 2000

async function request<T>(path: string): Promise<T | undefined> {
  const end = seerRequestDuration.startTimer({ path })

  try {
    const res = await fetch(`${env.SEER_URL}/${path}`, {
      headers: {
        'Authorization': `Bearer ${env.SEER_FIXED_AUTH}`
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    })

    seerRequestsTotal.inc({ path, status: res.status })

    if (!res.ok) {
      console.error(`seer request failure (${res.status}); response:`, await res.text())
      return undefined
    }

    const data = (await res.json()) as SeerResp<T>
    if (data.message !== "success") {
      console.error(`Error while fetching data from seer: ${data.message}`)
      return undefined
    }

    return data.data
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")
    seerRequestsTotal.inc({ path, status: timedOut ? "timeout" : "error" })
    console.error(`seer request to ${path} failed:`, err)
    return undefined
  } finally {
    end()
  }
}
