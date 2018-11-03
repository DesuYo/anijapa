import { JsonWebTokenError, TokenExpiredError } from '../helpers/types.import'

export class NotFoundError extends Error {
  constructor (msg) { super(msg) }
}

export class PermissionError extends Error {
  constructor () { super('Permission denied for this action.') }
}

export default (error, _, res, __) => {
  try {
    switch (true) {
      case error instanceof JsonWebTokenError || error instanceof TokenExpiredError: return res
        .status(401)
        .json({ error })

      case error instanceof PermissionError: return res
        .status(403)
        .json({ error: error.message })
        
      case error.isJoi: return res
        .status(400)
        .json(error.details.map((err) => ({
          key: err.context.key,
          message: err.message
        })))
      
      case error.name === 'MongoError' && error.code === 11000: return res
        .status(400)
        .json({ error: error.errmsg })

      case error instanceof NotFoundError: return res
        .status(404)
        .json({ error: error.message })
  
      default: throw error
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || error })
  }
}