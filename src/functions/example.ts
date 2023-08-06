import { trace, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('hello-world-function')

export function helloWorld() {
  return tracer.startActiveSpan('hello-world-function', (span) => {
    span.addEvent('hello-world-function called')
    span.setAttribute('hello-world-function-attribute', 'hello-world-function-attribute-value')
    span.end()
  })
}

export function fakeFailedHelloWorld() {
  return tracer.startActiveSpan('fake-failed-hello-world-function', (span) => {
    span.addEvent('fake-failed-hello-world-function called')
    span.setAttribute('fake-failed-hello-world-function-attribute', 'fake-failed-hello-world-function-attribute-value')
    span.setStatus({ code: SpanStatusCode.ERROR, message: 'fake-failed-hello-world-function failed' })
    span.end()
  })
}
