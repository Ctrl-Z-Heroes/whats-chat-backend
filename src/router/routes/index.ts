import { Express, Request, Response } from 'express'

export function index(app: Express) {
  app.get('/', (_req: Request, res: Response) => {
    res.send('this is a great commit')
  })
}
