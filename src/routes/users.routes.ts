import { Router, Request, Response } from 'express'
import authHandler from '../services/auth.handler'
import validationsHandler from '../services/validations.handler'
import { createUserSchema, patchUserSchema } from '../validations/users.schema'
import Users from '../models/users.model'

export default Router()
  .post(
    '/signup', 
    validationsHandler(createUserSchema), 
    async (req: Request, res: Response, next: Function) => {
      try {
        const user = new Users(req.body)
        return res
          .status(201)
          .json(await user.save())
        
      } catch (error) {
        next(error)
      }
    }
  )

  .patch(
    '/me',
    authHandler('member'),
    validationsHandler(patchUserSchema),
    async (req: Request, res: Response, next: Function) => {
      try {
        const user = await Users
          .updateOne({ id: req.query.id }, { $set: req.body })
          .exec()
       
        return res
          .status(200)
          .json(user)
        
      } catch (error) {
        next(error)
      }
    }
  )
