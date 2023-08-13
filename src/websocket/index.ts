import { IncomingMessage, Server, ServerResponse } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import log4js from 'log4js'
import { metrics } from '@opentelemetry/api'
import * as opentelemetry from '@opentelemetry/api'

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

const meter = metrics.getMeter('websocket-server')

const messages = meter.createCounter('ws_messages', {
  description: 'The total number of messages sent'
})

const connections = meter.createUpDownCounter('ws_connections', {
  description: 'The total number of connections'
})

export const startWebSocketServer = ({ server, logger }: WebSocketServerOptions) => {
  const roomManager = new Map<string, Room>()
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws, req) => {
    const roomId = req.url || '/'
    connections.add(1, { room_id: roomId })

    const activeSpan = opentelemetry.trace.getSpan(opentelemetry.context.active())
    if (!activeSpan) throw new Error('No active span')
    activeSpan.updateName(`WS:/${roomId}`)

    logger.info(`Connected to path - ${roomId}`)
    joinRoom(roomId, ws, roomManager, logger)
    logger.info(`Total clients in room ${roomId} => ${roomManager.get(roomId)?.clients.size}`)

    ws.on('message', (message) => {
      messages.add(1, { room_id: roomId })
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
    })

    ws.on('close', () => {
      connections.add(-1, { room_id: roomId })
      const room = roomManager.get(roomId)
      if (room) {
        room.clients.delete(ws)
        logger.info(`Client left room ${roomId}`)
      }
    })

    ws.on('error', (err) => {
      logger.error(err)
    })
  })
}
