import { Request, Response, RequestHandler } from 'express'
import { verify, VerifyErrors, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

export default (role: string): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const [ type, token ] = req.headers.authorization.split(' ')
      if (type === 'Bearer') {
        const { id }: any = verify(token, process.env.JWT_SECRET || '難しい鍵')

      }
    } catch (error) {
      next(error)
    }
  }
}