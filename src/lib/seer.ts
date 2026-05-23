import { env } from "cloudflare:workers"
import NowReading from "~/components/ssr/NowReading.astro"

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
  author: string,
  image: string,
  last_read: string,
  times_read: number
}

export interface NowReading {
  title: string,
  author: string
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

export async function getNowReading(): Promise<NowReading | undefined> {
  const data = await request<HardcoverData>("hardcover/books?status=current&limit=1")
  if (!data || !data.books) {
    return undefined
  }

  return {
    title: data.books[0].title,
    author: data.books[0].author
  }
}

export async function getNowPlaying(): Promise<NowPlaying | undefined> {
  return request("lastfm/now")
}

async function request<T>(path: string): Promise<T | undefined> {
  const res = await env.SEER.fetch(`https://internal/${path}`)
  if (!res.ok) {
    console.log(res)
    return undefined
  }

  const data = (await res.json()) as SeerResp<T>
  if (data.message !== "success") {
    console.error(`Error while fetching data from seer: ${data.message}`)
    return undefined
  }

  return data.data
}
