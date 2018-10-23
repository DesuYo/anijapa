import { Request, Response, RequestHandler } from 'express'
import { verify, JsonWebTokenError, sign } from 'jsonwebtoken'
import Users from '../models/users.model'
import * as httpClient from 'superagent'

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

export const googleAuthorize = (scope: string) => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { path } = req
      const { GOOGLE_ID } = process.env
      res.redirect(
        'https://accounts.google.com/o/oauth2/v2/auth' +
        `?client_id=${GOOGLE_ID}` +
        `&redirect_uri=https://${req.get('host')}${path}/callback` +
        `&scope=${scope}` +
        `&response_type=code`
      )
    } catch (error) {
      next(error)
    }
  }
}

export const googleCallback = (): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { path, query, db } = req
      const { GOOGLE_ID, GOOGLE_SECRET, JWT_SECRET } = process.env

      const { access_token } = (await httpClient
        .post('https://www.googleapis.com/oauth2/v4/token')
        .set('accept', 'application/json')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          client_id: GOOGLE_ID,
          client_secret: GOOGLE_SECRET,
          code: query['code'],
          redirect_uri: `https://${req.get('host')}${path}`,
          grant_type: 'authorization_code'
        }))
        .body
    
      const data = (await httpClient
        .get('https://www.googleapis.com/oauth2/v1/userinfo')
        .set('accept', 'application/json')
        .query({ access_token }))
        .body
      
      let user = await db['users']
        .findOne({ googleID: data.id })
        .exec()
        
      if (user) return res
        .status(200)
        .json({ 
          accessToken: sign({ _id: user.toObject()._id }, JWT_SECRET, { expiresIn: '2d' }),
          tokenType: 'Bearer' 
        })
      
      const { id, given_name, family_name, picture } = data
      user = (await db['users']
        .create({
          googleID: id,
          firstName: given_name,
          lastName: family_name,
          photo: picture
        }))
        .toObject()
      
      return res
        .status(201)
        .json({ 
          accessToken: sign({ _id: user._id }, JWT_SECRET, { expiresIn: '2d' }),
          tokenType: 'Bearer' 
        })
      
    } catch (error) {
      return next(error)
    }
  }
}


export default (role: string): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { authorization } = req.headers
      if (!authorization) 
        next(new JsonWebTokenError('Bearer token is required!'))
      const [ type, token ] = authorization.split(' ')
      if (type !== 'Bearer')
        next(new JsonWebTokenError('Bearer token is required!'))

      const { _id }: any = verify(token, process.env.JWT_SECRET || '難しい鍵')
      const doc = await Users
        .findById(_id, { __v: 0 })
        .exec()

      if (!doc) 
        next(new JsonWebTokenError('User with this token does not exist'))

      const user = doc.toObject()
      if (rolesMap[user.role] <  rolesMap[role]) 
        next(new PermissionError('Permission denied for this action'))

      req.user = user
      next()
      
    } catch (error) {
      next(error)
    }
  }
}
