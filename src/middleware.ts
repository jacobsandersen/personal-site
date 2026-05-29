import "~/lib/telemetry"
import "~/lib/traced-fetch"

import { defineMiddleware } from "astro:middleware";
import { trace, context } from "@opentelemetry/api";

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.isPrerendered) {
    return next();
  }

  const tracer = trace.getTracer("astro")

  const headers = ctx.request.headers;
  const ua = headers.get('user-agent') || 'unknown'
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'

  const span = tracer.startSpan(`${ctx.request.method} ${ctx.url.pathname}`, {
    attributes: {
      "http.user_agent": ua,
      "http.client_ip": ip,
      "http.method": ctx.request.method,
      "http.url": ctx.url.pathname
    }
  })

  return await context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const response = await next()
      span.setStatus({ code: 1 })
      return response
    } catch (e) {
      span.setStatus({ code: 2, message: String(e) })
      throw e
    } finally {
      span.end()
    }
  })
})