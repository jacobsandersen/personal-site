import { context, propagation } from "@opentelemetry/api";

const originalFetch = globalThis.fetch;
globalThis.fetch = function tracedFetch(input, init) {
  const headers = new Headers(init?.headers) ;
  
  propagation.inject(context.active(), headers, {
    set(_, key, value) {
      headers.set(key, value);
    }
  });

  return originalFetch.call(this, input, { ...init, headers })
}