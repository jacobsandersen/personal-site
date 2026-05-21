import { useEffect, useState } from "react";

interface NowPlaying {
  name: string,
  artist: string  
}

export default function NowPlaying() {
  const url = "https://seer.jacobandersen.dev/lastfm/now"

  async function getNowPlaying(): Promise<NowPlaying | undefined> {
    const resp = await fetch(url);
    if (!resp.ok) {
      return undefined 
    }

    const { data } = await resp.json();
    if (!data) {
      return undefined
    }

    return {
      name: data.name,
      artist: data.artist["#text"]
    }
  } 

  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    name: "loading",
    artist: "loading"
  })

  useEffect(() => {
    async function doGetNowPlaying() {
      const newNowPlaying = await getNowPlaying()
      if (!newNowPlaying) {
        return
      }

      setNowPlaying(newNowPlaying)
    }

    doGetNowPlaying()
    const id = setInterval(() => doGetNowPlaying(), 120 * 1000)
    return () => clearInterval(id)
  }, []);

  return (
    <p className="tw:text-xs">most recently: <i>{nowPlaying.name}</i> by {nowPlaying.artist}</p>
  );
}