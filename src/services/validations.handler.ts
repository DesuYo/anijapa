import { Request, Response, RequestHandler } from 'express'
import { Schema, ValidationErrorItem } from 'joi'

export default (sample: Schema): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { error, value } = sample
        .options({
          abortEarly: false,
          allowUnknown: true,
          stripUnknown: true
        })
        .validate(req.body)
        
      if (error) throw error
      
      req.body = value
      return next()
      
    } catch (error) {
      next(error)
    }
  }
}
