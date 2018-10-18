import { Router, Request, Response } from 'express'
import authHandler from '../services/auth.handler'
import * as _ from '../services/validations.handler'
import { sign } from 'jsonwebtoken'
import { hashSync } from 'bcryptjs'

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
        const { db, body } = req
        const { _id } = (await db['users']
          .create({ 
            ...body, 
            password: hashSync(body.password) 
          }))
          .toObject()
        return res
          .status(201)
          .json({ token: sign(
            { _id }, 
            process.env.JWT_SECRET || '難しい鍵'
          )})
        
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
        const { db, user, body } = req
        const result = await db['users']
          .updateOne(
            { _id: user._id }, 
            { $set: body }
          )
          .exec()
        return res
          .status(200)
          .json({ message: `Modified ${result.ok} document[s]` })
        
      } catch (error) {
        next(error)
      }
    }
  )

  .get(
    '/me',
    authHandler('member'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { user } = req
        return res
          .status(200)
          .json(user)
        
      } catch (error) {
        next(error)
      }
    }
  )
