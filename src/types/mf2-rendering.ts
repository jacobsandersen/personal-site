import { Mf2Object } from "~/content.config";
import { MicropubContent } from "~/lib/micropub";

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
    doc: MicropubContent
}

export interface FeedRenderProps extends RenderProps {
    feedInfo?: FeedInfo
    posts: MicropubContent[],
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