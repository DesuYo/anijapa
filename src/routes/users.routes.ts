import { Router, Request, Response } from 'express'
import { PostgresService } from '../services/sql.service'

const db = new PostgresService(process.env.PG_URL)

export default Router()
  .post('/signup', async (req: Request, res: Response) => {
    try {
      const user = await db.insert('users', req.body)
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  })

