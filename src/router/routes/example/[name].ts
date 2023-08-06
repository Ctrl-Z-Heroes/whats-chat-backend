import { metrics } from '@opentelemetry/api'
import { Express } from 'express'

const meter = metrics.getMeter('express-server')
const counter = meter.createCounter('example_counter', {
  description: 'The number of requests per name the server got'
})

export function exampleName(app: Express) {
  app.get('/example/:name', (req, res) => {
    counter.add(1, {
      route: '/example/:name',
      name: req.params.name
    })
    res.send('Hello ' + req.params.name)
  })
}
