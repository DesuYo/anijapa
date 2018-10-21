import { Router, Request, Response } from 'express'
import authHandler from '../services/auth.handler'
import * as _ from '../services/validations.handler'

export default Router()
  .post(
    '/',
    authHandler('admin'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { db, body } = req
        res
          .status(201)
          .json(await db['anime'].create(body))
      } catch (error) {
        next(error)
      }
    }
  )