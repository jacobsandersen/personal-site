import { Content, html, text } from "~/lib/content";
import { getFirstPropertyOrDefault } from "../../util/mf2-util";
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

    async getContent(): Promise<Content> {
        const content = getFirstPropertyOrDefault<unknown>(this.props, 'content', null)
        if (typeof content === 'string') {
            return text(content)
        } else if (typeof content === 'object' && content !== null && 'html' in content && typeof (content as any).html === 'string') {
            return html((content as any).html as string)
        } else {
            throw new Error('Invalid content property format for article')
        }
    }
}