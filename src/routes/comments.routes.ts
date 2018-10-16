import { Router, Request, Response } from 'express'
import authHandler, { PermissionError } from '../services/auth.handler'
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
    _.validationsHandler({
      text: _.$VARCHAR(300),
      animeId: _.$GUID(),
      replies: _.ARRAY(_.GUID()),
      likes: _.ARRAY(_.GUID())
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const { body, user, db } = req
        return res
          .status(201)
          .json(await db['comments'].create({
            ...body,
            userId: user._id
          }))
      }
      catch (error) {
        next(error)
      }
    }
  )

  .patch(
    '/:id',
    authHandler('member'),
    _.validationsHandler({
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
        const { db, user, params, body } = req
        const comment = await db['comment']
          .deleteOne({
            _id: params.id,
            userId: user._id
          }).error()

      return res
        .status(200)
        .json(comment)
      }
      catch (error) {
        next(error)
      }
    }
  )

  /*.patch(
    '/:id/likes',
    authHandler('member'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const comment = (await Comments.findOne({
          _id: req.params.id  
        })).toObject()

        const { _id } = req.query.user
        if (comment.likes.includes(_id)) {
          throw new Error('Like has already been posted')
        }
        const likedComment = Comments.updateOne({
          _id: req.params.id}, { 
          $push: {
            likes: _id 
          }
        })

        return res
          .status(200)
          .json(likedComment)
      }
      catch (error) {
        next(error)
      }
    }
  )

  .delete(
    '/:id/likes',
    authHandler('member'),
    async (req: Request, res: Response, next: Function) => {
      try {
        const comment = (await Comments.findOne({
          _id: req.params.id
        })).toObject()

        const { _id } = req.query.user
        if (!comment.likes.includes(_id)) {
          throw new Error('Like has not been posted yet')
        }
        const likedComment = Comments.updateOne({
          _id: req.params.id}, { 
          $pull: {
            likes: _id 
          }
        })

        return res
          .status(200)
          .json(likedComment)
      }
      catch (error) {
        next(error)
      }
    }
  )

  .delete(
    '/',
    authHandler('admin'),
    _.validationsHandler({
      id: _.$GUID()
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const comment = await Comments
          .findByIdAndRemove(req.body.id)

      return res
        .status(200)
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

        const comments = await Comments
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

  )*/