import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { MeterProvider } from '@opentelemetry/sdk-metrics'

// Add your port and startServer to the Prometheus options
const options = { port: 9090 }
const exporter = new PrometheusExporter(options)

// Creates MeterProvider and installs the exporter as a MetricReader
const meterProvider = new MeterProvider()
meterProvider.addMetricReader(exporter)
const meter = meterProvider.getMeter('example-prometheus')

// Now, start recording data
const counter = meter.createCounter('example_counter', {
  description: 'Example of a counter'
})
counter.add(10, { pid: process.pid })
console.log('Counter recorded')
