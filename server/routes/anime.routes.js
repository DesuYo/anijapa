import { Router } from 'express'
import authHandler from '../services/auth.handler'
import * as _ from '../services/validations.handler'

export default Router()
  .post(
    '/',
    authHandler('admin'),
    validationHandler({
      
    }),
    async (req, res, next) => {
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