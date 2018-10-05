import { Router, Request, Response } from 'express'
import { PostgresService } from '../services/sql.service'

const db = new PostgresService(process.env.PG_URL)

export default Router()
  .post('/signup', async (req: Request, res: Response): Promise<object> => {
    try {
      const user = await db.insert('users', req.body)
      return res.status(201).json(user)
    } catch (error) {
      return res.status(500).json(error)
    }
  })