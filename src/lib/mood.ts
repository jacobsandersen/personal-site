import Bastion from "~/lib/bastion"
import Mf2Extractor from "~/lib/extractor/Mf2Extractor"
import { PostMf2Type, PostType } from "~/types/bastion"

/**
 * Resolves to the most recent mood, `null` when no mood has been posted, or
 * `undefined` when the lookup failed.
 */
export async function getLatestMood(): Promise<string | null | undefined> {
  try {
    const { items } = await Bastion.posts()
      .h(PostMf2Type.ENTRY)
      .type(PostType.MOOD)
      .perPage(1)
      .query()

    if (items.length !== 1) return null
    return new Mf2Extractor(items[0]).getMood() ?? null
  } catch (err) {
    console.error("load latest mood failed:", err)
    return undefined
  }
}
