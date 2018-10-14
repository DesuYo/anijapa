import { Router, Request, Response } from 'express'
import authHandler, { PermissionError } from '../services/auth.handler'
import * as _ from '../services/validations.handler'
import Comments from '../models/comments.model'

export default Router()
  .post(
    '/', 
    authHandler('member'),
    _.validationsHandler({
      text: _.$VARCHAR(400),
      animeId: _.$GUID(),
      replies: _.ARRAY(_.GUID()),
      likes: _.ARRAY(_.GUID())
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const comment = new Comments(req.body)
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
    '/',
    authHandler('member'),
    _.validationsHandler({
      text: _.$VARCHAR(400)
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const comment = await Comments
          .updateOne({ _id: req.query.user._id }, { $set: req.body})
          .exec()

        return res
          .status(200)
          .json(comment)
      }
      catch (error) {
        next(error)
      }
    }
  )

  .delete(
    '/',
    authHandler('member'),
    _.validationsHandler({
      id: _.$GUID()
    }),
    async (req: Request, res: Response, next: Function) => {
      try {
        const comment = await Comments
          .findOneAndRemove({
            _id: req.body.id,
            userId: req.query.user._id
          })

      return res
        .status(200)
        .json(comment)
      }
      catch (error) {
        next(error)
      }
    }
  )

  .patch(
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

  )