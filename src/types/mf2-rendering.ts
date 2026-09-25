import { FeedDto, PostDto } from "./bastion";

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
    doc: PostDto
}

export interface FeedRenderProps extends RenderProps {
    feedInfo?: FeedInfo
    feed: FeedDto,
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