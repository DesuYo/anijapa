import { Request, Response, RequestHandler } from 'express'
import { verify, VerifyErrors, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import Users from '../models/users.model'

const rolesMap: any = {
  member: 0,
  admin: 1,
  overlord: 2
}

export class PermissionError {
  public message: string
  constructor (msg: string) {
    this.message = msg
  }
}

export default (role: string): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const [ type, token ] = req.headers.authorization.split(' ')

      if (type !== 'Bearer')
        next(new JsonWebTokenError('Bearer token is required!'))

      const { _id }: any = verify(token, process.env.JWT_SECRET || '難しい鍵')
      const doc = await Users
        .findById(_id, {
          password: 0,
          __v: 0
        })
        .exec()
      const user = doc.toObject()

      if (!user) 
        next(new JsonWebTokenError('User with this token does not exist'))

      if (rolesMap[user.role] <  rolesMap[role]) 
        next(new PermissionError('Permission denied for this action'))

      req.user = user
      next()
      
    } catch (error) {
      next(error)
    }
  }
}