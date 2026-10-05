import { env } from "./env";

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

if (env.TELEMETRY_ENABLE) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: "herald"
    }),
    traceExporter: new OTLPTraceExporter({
      url: env.TELEMETRY_OTEL_EXPORTER_ENDPOINT,
      headers: {
        'api-key': env.TELEMETRY_OTEL_API_KEY
      }
    })
  });

  sdk.start();

  process.on('SIGTERM', () => sdk.shutdown())
}
