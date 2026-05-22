import { Mf2ObjectProperties } from "~/content.config";
import Mf2Extractor from "./Mf2Extractor";
import { Mood } from "../content";

export default class MoodMf2Extractor extends Mf2Extractor {
    constructor(props: Mf2ObjectProperties) {
      super(props)
    }
  
    getTitle(): string {
      return `Mood log from ${this.getLongCreatedFrom()}` 
    }

    getMinimalTitle(): string {
      return "Logged his mood" 
    }

    getMood(): string {
        const mood = this.props.mood
        if (!mood || mood.length === 0) {
            throw new Error("No mood found for Mood")
        }

        return mood[0] as string
    }

    async getPost(): Promise<Mood> {
      return {
        type: 'mood',
        mood: this.getMood(),
        content: this.getParsedContentProp()
      } 
    }
}