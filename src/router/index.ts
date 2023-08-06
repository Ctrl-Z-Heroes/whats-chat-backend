import { exampleName } from './routes/example/[name]'
import { index } from './routes/index'
import { Express } from 'express'

const routes = {
  '/': index,
  '/example/:name': exampleName
} as const

export const router = (app: Express) => {
  const keys = Object.keys(routes) as Array<keyof typeof routes>
  keys.forEach((route) => {
    const path = routes[route]
    path(app)
  })
}
