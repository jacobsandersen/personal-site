import { env } from "cloudflare:workers"

interface SeerResp<T> {
  message: string,
  data: T | undefined
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

export async function getNowReading(): Promise<NowReading | undefined> {
  return request("hardcover/now")
}

export async function getNowPlaying(): Promise<NowPlaying | undefined> {
  return request("lastfm/now")
}

async function request<T>(path: string): Promise<T | undefined> {
  const res = await env.SEER.fetch(path)
  if (!res.ok) {
    return undefined
  }

  const data = (await res.json()) as SeerResp<T>
  if (data.message !== "success") {
    console.error(`Error while fetching data from seer: ${data.message}`)
    return undefined
  }

  return data.data
}
