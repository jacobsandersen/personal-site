import type { APIRoute } from "astro";
import { atomResponse, badRequest } from "~/lib/atom";
import { parseYear, yearFeed } from "~/lib/feeds";

export const GET: APIRoute = ({ params }) => {
  const year = parseYear(params.year)
  if (year === null) return badRequest("Invalid year")

  return atomResponse(yearFeed(year))
}
