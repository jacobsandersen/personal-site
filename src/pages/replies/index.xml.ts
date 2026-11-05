import type { APIRoute } from "astro";
import { atomResponse } from "~/lib/atom";
import { typeFeed } from "~/lib/feeds";
import { PostType } from "~/types/bastion";

export const GET: APIRoute = () => atomResponse(typeFeed(PostType.REPLY))
