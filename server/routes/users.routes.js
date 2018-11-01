import { Router } from 'express'
import authHandler, { possiblePermissions } from '../services/auth.handler'
import * as _ from '../services/validations.handler'
import { NotFoundError, PermissionError } from '../services/errors.handler'

export default Router()
  .get(
    '/me',
    authHandler('get:basic', 'get:admin'),
    async (req, res, next) => {
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
  .patch(
    '/me',
    authHandler('patch:basic', 'patch:admin'),
    _.validationHandler({
      username: _.SLUG(16),
      photo: _.URI(256),
      firstName: _.NAME(16),
      lastName: _.NAME(16)
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
        const result = await db['users']
          .find({ 
            username: new RegExp(`.*${query.username}.*`),
            firstName: new RegExp(`.*${query.firstName}.*`),
            lastName: new RegExp(`.*${query.lastName}.*`) 
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
    _.validationHandler({
      permissions: _.ARRAY(_.ENUM(possiblePermissions)),
      username: _.SLUG(16),
      photo: _.URI(256),
      firstName: _.NAME(16),
      lastName: _.NAME(16)
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