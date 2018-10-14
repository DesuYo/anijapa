import { Router, Request, Response } from 'express'
import authHandler from '../services/auth.handler'
import * as _ from '../services/validations.handler'
import Users from '../models/users.model'

export default Router()
  .post(
    '/signup', 
    _.validationsHandler({
      username: _.$SLUG(16),
      email: _.$EMAIL(),
      password: _.$PASSWORD(8)
    }), 
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
    _.validationsHandler({
      password: _.$VARCHAR(256),
      username: _.SLUG(16),
      firstName: _.NAME(16),
      lastName: _.NAME(16),
      birthDate: _.DATE(),
      photo: _.URI(256)
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const user = await Users
          .updateOne({ _id: req.query.id }, { $set: req.body })
          .exec()
       
        return res
          .status(200)
          .json(user)
        
      } catch (error) {
        next(error)
      }
    }
  )
