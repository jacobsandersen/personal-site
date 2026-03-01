import { Mf2Document } from "./mf2-document"

export enum RenderMethod {
  Minimal = "minimal",
  Preview = "preview",
  Full = "full"
}

export interface RenderProps {
    renderMethod?: RenderMethod
    class?: string
}

export interface DocumentRenderProps extends RenderProps {
    doc: Mf2Document
}

export interface FeedRenderProps extends RenderProps {
    feedInfo?: FeedInfo
    posts: Mf2Document[],
    itemClass?: string;
}

interface HeaderConfig {
    hidden?: boolean;
    level?: number;
    class?: string;
}

interface FeedInfo {
    title: string;
    url: string;
    headerConfig?: HeaderConfig;
}