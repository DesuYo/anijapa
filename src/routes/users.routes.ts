import { Router, Request, Response } from 'express'
<<<<<<< HEAD
import { PostgresService } from '../services/sql.service'

const db = new PostgresService(process.env.PG_URL)

export default Router()
  .post('/signup', async (req: Request, res: Response): Promise<object> => {
    try {
      const user = await db.insert('users', req.body)
=======
import { Table } from '../services/sql.service'

const users = new Table(process.env.PG_URL, 'users')

export default Router()
  .post('/signup', async (req: Request, res: Response) => {
    try {
      const user = await users.insert(req.body)
>>>>>>> 1046561eba945e3d863c02954b0a4d42d847aa8d
      return res.status(201).json(user)
    } catch (error) {
      return res.status(500).json(error)
    }
<<<<<<< HEAD
  })
=======
  })

>>>>>>> 1046561eba945e3d863c02954b0a4d42d847aa8d
