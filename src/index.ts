import log4js from 'log4js'
import './telemetry/meter'
import { startExpressWithMiddleware } from './middleware'
import { router } from './router'
import { createServer } from 'http'
import { startWebSocketServer } from './websocket'

const logger = log4js.getLogger('server')
logger.level = 'trace'

// This is the entry point for the application
// It starts express, middleware and routes
const app = startExpressWithMiddleware()
router(app)

// Starts http server and websocket server
const server = createServer(app)
startWebSocketServer({ server, logger })

server.listen(8081, () => {
  logger.info('Server listening on port 8081')
})
