import { Request, Response, RequestHandler } from 'express'
import { verify, JsonWebTokenError } from 'jsonwebtoken'
import Users from '../models/users.model'
import * as httpClient from 'superagent'

const rolesMap: any = {
  member: 0,
  admin: 1,
  overlord: 2
}

export class OAuthError extends Error {
  constructor (msg: string) {
    super(msg)
  }
}

export class PermissionError {
  public message: string
  constructor (msg: string) {
    this.message = msg
  }
}

const urls: any = {
  github: { 
    authorize: 'https://github.com/login/oauth/authorize',
    token: 'https://github.com/login/oauth/access_token',
    profile: 'https://api.github.com/user'
  }
}

export const initOAuthClient = (config: IOAuthConfig) => {
  return (req: Request, _: Response, next: Function) => {
    try {
      req.oauth = config
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const authorize = (resource: string, redirect_uri: string = '') => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { client_id } = req.oauth[resource]
      return res.redirect(urls[resource].authorize + `?client_id=${client_id}&redirect_uri=${redirect_uri}`)
    } catch (error) {
      next(error)
    }
  }
}

export const callback = (resource: string, redirect_uri: string = '') => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { oauth, query, db } = req
      const { client_id, client_secret } = oauth[resource]
      if (!query['code']) 
        return next(new OAuthError('Missing authorization code.'))
  
      const { access_token } = (await httpClient
        .post(urls[resource].token)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .send({
          client_id,
          client_secret,
          redirect_uri,
          code: query['code']
        })).body
      const user = (await httpClient
        .get(urls[resource].profile)
        .query({ access_token })).body
      console.log(user)
      req.user = user
      return res
        .status(200)
        .end()
      
    } catch (error) {
      return next(error)
    }
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
