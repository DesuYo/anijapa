import { Router } from 'express'
import authHandler, { possiblePermissions } from '../services/auth.handler'
import '../services/validations.handler'
import { NotFoundError, PermissionError } from '../services/errors.handler'
import { Request, Response } from '../helpers/types.import'
import { validationHandler, SLUG, URI, NAME, ARRAY, ENUM } from '../services/validations.handler';

export default Router()
  .get(
    '/me',
    authHandler('get:basic', 'get:admin'),
    async (req, res, next) => {
      try {
        const { user } = req
        return res
          .json(user)
        
      } catch (error) {
        next(error)
      }
    }
  )
  .patch(
    '/me',
    authHandler('patch:basic', 'patch:admin'),
    validationHandler({
      username: SLUG(16),
      photo: URI(256),
      firstName: NAME(16),
      lastName: NAME(16)
    }),
    async (req, res, next) => {
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
  .delete(
    '/me',
    authHandler('delete:basic', 'delete:admin'),
    async (req, res, next) => {
      try {
        const { db, user } = req
        await db['users']
          .deleteOne({ _id: user._id })
          .exec()
        res
          .status(204)
          .end()
      } catch (error) {
        next(error)
      }
    }
  )
  .get(
    '/users',
    authHandler('get:admin'),
    async (req, res, next) => {
      try {
        const { db, query } = req
        const { username = '', firstName = '', lastName = ''} = query
        const result = await db['users']
          .find({ 
            username: new RegExp(`.*${username}.*`),
            firstName: new RegExp(`.*${firstName}.*`),
            lastName: new RegExp(`.*${lastName}.*`) 
          })
          .exec()
        return res
          .status(200)
          .json(result)
        
      } catch (error) {
        next(error)
      }
    }
  )
  .patch(
    '/users/:id',
    authHandler('patch:admin'),
    validationHandler({
      permissions: ARRAY(ENUM(possiblePermissions)),
      username: SLUG(16),
      photo: URI(256),
      firstName: NAME(16),
      lastName: NAME(16)
    }),
    async (req, res, next) => {
      try {
        const { db, params, body } = req
        const target = await db['users']
          .findById(params.id)
          .exec()
        if (!target) 
          return next(new NotFoundError('User not found'))
        if (target.toObject().permissions.some((el) => el === 'overlord'))
          return next(new PermissionError())
        await target
          .update({ $set: body })
          .exec()
        return res
          .status(204)
          .end()
        
      } catch (error) {
        next(error)
      }
    }
  )