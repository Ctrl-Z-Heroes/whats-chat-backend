import { Resource } from '@opentelemetry/resources'
import { metrics } from '@opentelemetry/api'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

const meterProvider = new MeterProvider({
  resource: new Resource({ 'service.name': 'whats-chat' })
})
const metricExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4317/v1/metrics'
})
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 60000
})
meterProvider.addMetricReader(metricReader)
metrics.setGlobalMeterProvider(meterProvider)
