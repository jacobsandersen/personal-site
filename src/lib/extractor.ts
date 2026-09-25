import Mf2Extractor from "./extractor/Mf2Extractor";
import type { HEntryHint } from "./extractor/Mf2Extractor";
import { PostDto } from "~/types/bastion";

export function createHEntryExtractor(doc: PostDto): Mf2Extractor {
  if (doc.type !== 'h-entry') {
    throw new Error("non h-entry does not use extractor system")
  }
  if (!doc.subtype) {
    throw new Error("h-entry missing subtype hint")
  }
  return new Mf2Extractor(doc)
}

// Backwards compat for existing imports
export function determineExtractor(doc: PostDto): Mf2Extractor {
  return createHEntryExtractor(doc)
}

export type { HEntryHint };
export { Mf2Extractor };
export default Mf2Extractor;
