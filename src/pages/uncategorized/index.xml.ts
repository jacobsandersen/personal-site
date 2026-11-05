import type { APIRoute } from "astro";
import { atomResponse } from "~/lib/atom";
import { uncategorizedFeed } from "~/lib/feeds";

export const GET: APIRoute = () => atomResponse(uncategorizedFeed())
