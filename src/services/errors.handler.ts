import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ValidationError, ValidationErrorItem } from 'joi'
import { Request, Response } from 'express'
import { PermissionError } from './auth.handler'

export default (error: any, req: Request, res: Response, next: Function) => {
  try {
    switch (true) {
      case error instanceof JsonWebTokenError || error instanceof TokenExpiredError: return res
        .status(401)
        .json({ error })

      case error instanceof PermissionError: return res
        .status(403)
        .json({ error })
        
      case error.isJoi: return res
        .status(400)
        .json(error.details.map((err: ValidationErrorItem) => ({
          key: err.context.key,
          message: err.message
        })))
      
      case error.name === 'MongoError' && error.code === 11000: return res
        .status(400)
        .json({ error: error.errmsg })
  
      default: throw error
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || error })
  }
}