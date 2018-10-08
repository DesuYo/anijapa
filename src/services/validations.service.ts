import { Request, Response, RequestHandler } from 'express'
import { Schema, ValidationErrorItem } from 'joi'

module.exports = (sample: Schema): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { error, value } = sample
        .options({
          abortEarly: false,
          allowUnknown: true
        })
        .validate(req.body)

      if (error) return res
        .status(400)
        .json(error.details.map((err: ValidationErrorItem) => ({
          key: err.context.key,
          message: err.message
        })))
      
      else {
        req.body = value
        return next()
      }

    } catch (error) {
      
    }
  }
}
