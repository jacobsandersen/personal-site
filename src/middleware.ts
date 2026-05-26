import "~/lib/telemetry"
import "~/lib/traced-fetch"

import { defineMiddleware } from "astro:middleware";
import { trace, context } from "@opentelemetry/api";

export const onRequest = defineMiddleware(async (ctx, next) => {
  const tracer = trace.getTracer("astro");
  const span = tracer.startSpan(`${ctx.request.method} ${ctx.url.pathname}`);

  return await context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const response = await next();
      span.setStatus({ code: 1 });
      return response;
    } catch (e) {
      span.setStatus({ code: 2, message: String(e) });
      throw e;
    } finally {
      span.end();
    }
  });
});