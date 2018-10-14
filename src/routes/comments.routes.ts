import { Router, Request, Response } from 'express'
import * as _ from '../services/validations.handler'
import Comments from '../models/comments.model'
import { userInfo } from 'os';

export default Router()
  .post(
    '/', 
    _.validationsHandler({
      text: _.$VARCHAR(400),
      animeId: _.$VARCHAR(10)
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
    _.validationsHandler({

    }) 
)