import { Mf2Object } from "~/content.config";

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
    doc: Mf2Object
}

export interface FeedRenderProps extends RenderProps {
    feedInfo?: FeedInfo
    posts: Mf2Object[],
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