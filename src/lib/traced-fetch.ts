import { context, propagation, trace } from "@opentelemetry/api";

const originalFetch = globalThis.fetch;
globalThis.fetch = function tracedFetch(input, init) {
  const headers = new Headers(init?.headers);
  const ctx = context.active();
  const span = trace.getSpan(ctx);

  console.log(`[fetch] ${input} traceId=${span?.spanContext().traceId || 'none'}`);  
  
  propagation.inject(context.active(), headers, {
    set(_, key, value) {
      headers.set(key, value);
    }
  });

  return originalFetch.call(this, input, { ...init, headers })
}