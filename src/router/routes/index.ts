import { Express, Request, Response } from 'express'

export function index(app: Express) {
  app.get('/', (_req: Request, res: Response) => {
    res.send('This is an incredible test that shows the cicd works')
  })
}
