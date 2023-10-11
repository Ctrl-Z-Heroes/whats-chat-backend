/*instrumentation.ts*/
import * as opentelemetry from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { Resource } from '@opentelemetry/resources'
import { WSInstrumentation } from 'opentelemetry-instrumentation-ws'

const otelCollectorAddress = process.env.OTEL_COLLECTOR_ADDRESS || 'http://otel_collector:4318'
/* const otelCollectorAddress = 'http://localhost:4318' */

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    url: `${otelCollectorAddress}/v1/traces`,
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {}
  }),
  metricReader: new PeriodicExportingMetricReader({
    // exporter: new ConsoleMetricExporter()
    exporter: new OTLPMetricExporter({
      url: `${otelCollectorAddress}/v1/metrics`
    })
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new WSInstrumentation({
      sendSpans: true,
      enabled: true,
      messageEvents: true
    })
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'whats-chat'
  })
})

sdk.start()
