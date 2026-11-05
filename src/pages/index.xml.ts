import type { APIRoute } from "astro";
import { atomResponse } from "~/lib/atom";
import { indexFeed } from "~/lib/feeds";

export const GET: APIRoute = () => atomResponse(indexFeed())
