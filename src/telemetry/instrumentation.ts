import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { BatchSpanProcessor, NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

const options = {
  headers: {
    'my-header': 'header-value'
  },
  url: 'http://localhost:9411/api/v2/spans',
  // optional interceptor
  getExportRequestHeaders: () => {
    return {
      'my-header': 'header-value'
    }
  }
}

const exporter = new ZipkinExporter(options)

const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'node-man',
      [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0'
    })
  )
})

provider.addSpanProcessor(new BatchSpanProcessor(exporter))
provider.register()

const instrumentations = getNodeAutoInstrumentations({
  // Optionally, you can provide a logger or other configuration for auto-instrumentations.
})

instrumentations.forEach((instrumentation) => {
  instrumentation.enable()
})
