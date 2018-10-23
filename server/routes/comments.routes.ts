import { Router, Request, Response } from 'express'
import authHandler from '../services/auth.handler'
import { PermissionError } from '../services/errors.handler'
import * as _ from '../services/validations.handler'

export default Router()
  .patch(
    '/:id/likes',
    authHandler('member'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { db, user, params } = req
        const comment = await db['comments']
          .findById(params.id)
          .exec()
        const operator = comment.toObject().likes.includes(user._id) ? '$pull' : '$push'
        const result = await db['comments']
          .findByIdAndUpdate(
            params.id,
            {
              [operator]: { likes: user._id }
            },
            { new: true }
          )
          .exec()
        return res
          .status(200)
          .json(result)

      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    '/', 
    authHandler('member'),
    _.validationHandler({
      text: _.$VARCHAR(300),
      animeId: _.$GUID(),
      replies: _.ARRAY(_.GUID()),
      likes: _.ARRAY(_.GUID())
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { body, user, db } = req
        const comment = new db['comments']({ ...body, userId: user._id })
        return res
          .status(201)
          .json(await comment.save())
      }
      catch (error) {
        next(error)
      }
    }
  )

  .patch(
    '/:id',
    authHandler('member'),
    _.validationHandler({
      text: _.$VARCHAR(300)
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { db, user, params, body } = req
        const result = await db['comment']
          .updateOne(
            { _id: params.id, userId: user._id },
            { $set: { text: body.text } },
            { new: true }
          )
          .exec()
        return res 
          .status(result.ok < 1 ? 400 : 200)
          .json({ result })
      }
      catch (error) {
        next(error)
      }
    }
  )

  .delete(
    '/:id',
    authHandler('member'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { db, user, params } = req
        const comment = await db['comment']
          .deleteOne({
            _id: params.id,
            userId: user._id
          }).error()

      return res
        .status(204)
        .json(comment)
      }
      catch (error) {
        next(error)
      }
    }
  )

  .delete(
    '/:id',
    authHandler('admin'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { db, params } = req
        const comment = await db['comment']
          .deleteOne({
            _id: params.id
          }).error()

      return res
        .status(204)
        .json(comment)
      }
      catch (error) {
        next(error)
      }
    }
  )

  .get(
    '/',
    authHandler('admin'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { text = '', ...rest } = req.query

        const { db } = req
        const comments = await db['comment']
          .find({
            text: new RegExp('.*' + text + '.*', 'i'),
            rest
          })

        return res
          .status(200)
          .json(comments)
      }
      catch (error) {
        next(error)
      }
    }
  )