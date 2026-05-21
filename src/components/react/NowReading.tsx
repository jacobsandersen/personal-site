import { useEffect, useState } from "react";

interface NowReading {
  title: string,
  author: string  
}

export default function NowReading() {
  const url = "https://seer.jacobandersen.dev/hardcover/now"

  async function getNowReading(): Promise<NowReading | undefined> {
    const resp = await fetch(url);
    if (!resp.ok) {
      return undefined 
    }

    const { data } = await resp.json();
    if (!data) {
      return undefined
    }

    return {
      title: data.title,
      author: data.author
    }
  } 

  const [nowReading, setNowReading] = useState<NowReading>({
    title: "loading",
    author: "loading"
  })

  useEffect(() => {
    async function doGetNowReading() {
      const newNowReading = await getNowReading()
      if (!newNowReading) {
        return
      }

      setNowReading(newNowReading)
    }

    doGetNowReading()
  }, []);

  return (
    <p className="tw:text-xs">currently: <i>{nowReading.title}</i> by {nowReading.author}</p>
  );
}