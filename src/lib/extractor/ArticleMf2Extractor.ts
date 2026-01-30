import { getFirstPropertyOrDefault } from "../../util/mf2-util";
import { Article } from "../content";
import Mf2Extractor from "./Mf2Extractor";

export default class ArticleMf2Extractor extends Mf2Extractor {
    getRootElem(): string {
        return 'article'
    }

    getTitle(): string {
        return getFirstPropertyOrDefault<string>(this.props, 'name', 'Untitled Article') 
    }

    getTitleClasses(): string[] {
        return ['p-name']
    }

    async getPost(): Promise<Article> {
        return {
            type: 'article',
            content: this.getParsedContentProp()
        }
    }
}
