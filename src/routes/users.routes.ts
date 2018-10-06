import { Router, Request, Response } from 'express'
import { Table } from '../services/sql.service'

const users = new Table(process.env.PG_URL, 'users')

export default Router()
  .post('/signup', async (req: Request, res: Response) => {
    try {
      const user = await users.insert(req.body)
      return res.status(201).json(user)
    } catch (error) {
      return res.status(500).json(error)
    }
  })

