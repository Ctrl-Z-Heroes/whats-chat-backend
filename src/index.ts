import log4js from 'log4js'
import './telemetry/meter'
import { startExpressWithMiddleware } from './middleware'
import { router } from './router'

const logger = log4js.getLogger('server')
logger.level = 'trace'

const app = startExpressWithMiddleware()
router(app)

app.listen(8081)
