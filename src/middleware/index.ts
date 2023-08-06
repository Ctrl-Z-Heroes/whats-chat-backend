import express, { json } from 'express'
import cors from 'cors'
import { measureRequestDuration } from '../telemetry/monitoring'
import { addCorsHeaders } from './cors'

const middlewares = [json(), cors(), addCorsHeaders, measureRequestDuration]

export const startExpressWithMiddleware = () => {
  const app = express()
  middlewares.forEach((middleware) => {
    app.use(middleware)
  })
  return app
}
