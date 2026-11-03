// Manual webmention submission for people without a webmention sender.
// The permalink form posts here (a plain HTML form, so it works without JS);
// we relay to Bastion's receiver server-side, which avoids CORS and keeps the
// visitor on the site, then redirect back to the post with a status code.
import type { APIRoute } from "astro";
import { env } from "~/lib/env";
import { isHttpUrl } from "~/util/url";

export const prerender = false;

type Status = "sent" | "invalid" | "unavailable";

// Only ever redirect back to a path on this site, never to submitted input.
function backTo(target: string | undefined, status: Status): string {
  let path = "/";
  try {
    if (target && new URL(target).origin === new URL(env.PUBLIC_URL).origin) {
      path = new URL(target).pathname;
    }
  } catch {
    // fall through to "/"
  }
  return `${path}?webmention=${status}#send-webmention`;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData().catch(() => undefined);
  const source = form?.get("source");
  const target = form?.get("target");
  const sourceUrl = typeof source === "string" ? source.trim() : "";
  const targetUrl = typeof target === "string" ? target.trim() : undefined;

  if (!isHttpUrl(sourceUrl) || !targetUrl || !isHttpUrl(targetUrl)) {
    return redirect(backTo(targetUrl, "invalid"), 303);
  }

  try {
    const res = await fetch(`${env.BASTION_URL}/webmention`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ source: sourceUrl, target: targetUrl }),
      signal: AbortSignal.timeout(10_000),
    });
    const status: Status = res.ok ? "sent" : res.status < 500 ? "invalid" : "unavailable";
    return redirect(backTo(targetUrl, status), 303);
  } catch {
    return redirect(backTo(targetUrl, "unavailable"), 303);
  }
};
