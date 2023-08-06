import { IncomingMessage, Server, ServerResponse } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import log4js from 'log4js'
import { metrics, trace } from '@opentelemetry/api'

type WebSocketServerOptions = {
  server: Server<typeof IncomingMessage, typeof ServerResponse>
  logger: log4js.Logger
}

type Room = {
  roomId: string
  clients: Set<WebSocket>
}

const joinRoom = (roomId: string, ws: WebSocket, roomManager: Map<string, Room>, logger: log4js.Logger) => {
  const room = roomManager.get(roomId) || { roomId, clients: new Set<WebSocket>() }
  room.clients.add(ws)
  roomManager.set(roomId, room)
  logger.info(`Client joined room ${roomId}`)
}

const meter = metrics.getMeter('express-server')
const gauge = meter.createUpDownCounter('websocket_connections_gauge', {
  description: 'The number of WebSocket connections made to the server'
})

const tracer = trace.getTracer('websocket-server')

export const startWebSocketServer = ({ server, logger }: WebSocketServerOptions) => {
  const roomManager = new Map<string, Room>()
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws, req) => {
    const roomId = req.url || '/'
    gauge.add(1, { path: roomId })

    logger.info(`Connected to path - ${roomId}`)

    joinRoom(roomId, ws, roomManager, logger)
    logger.info(`Total clients in room ${roomId} => ${roomManager.get(roomId)?.clients.size}`)

    ws.on('message', (message) => {
      const span = tracer.startSpan('websocket_message_processing')
      span.addEvent('message_received') // Adding message as an event to the span
      span.setAttribute('message', message.toString()) // Adding message as an attribute to the span
      logger.info(`Received message => ${message}`)
      ws.send(`Hello, you sent => ${message}`)

      const room = roomManager.get(roomId)
      if (room) {
        room.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(`Broadcast message => ${message}`)
          }
        })
      }
      span.end()
    })

    ws.on('close', () => {
      const room = roomManager.get(roomId)
      if (room) {
        room.clients.delete(ws)
        gauge.add(-1, { path: roomId })
        logger.info(`Client left room ${roomId}`)
      }
    })
    ws.on('error', (err) => {
      logger.error(err)
    })
  })
}
