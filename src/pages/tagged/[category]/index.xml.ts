import type { APIRoute } from "astro";
import { atomResponse, badRequest } from "~/lib/atom";
import { tagFeed } from "~/lib/feeds";

export const GET: APIRoute = ({ params }) => {
  const { category } = params
  if (!category) return badRequest("Missing tag")

  return atomResponse(tagFeed(category))
}
