import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { TELEMETRY_ENABLE, TELEMETRY_OTEL_EXPORTER_ENDPOINT } from 'astro:env/server';

const enabled = TELEMETRY_ENABLE

if (enabled) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: "astro"
    }),
    traceExporter: new OTLPTraceExporter({
      url: TELEMETRY_OTEL_EXPORTER_ENDPOINT
    })
  });

  sdk.start();

  process.on('SIGTERM', () => sdk.shutdown())
}
