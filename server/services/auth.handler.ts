import { verify, sign } from 'jsonwebtoken'
import Users, { IUser } from '../models/users.model'
import * as httpClient from 'superagent'
import { PermissionError } from './errors.handler'
import { Request, Response, RequestHandler, 
  JsonWebTokenError, MongooseDocument } from '../helpers/types.import'

export const possiblePermissions = [
  'get:basic', 'post:basic', 'patch:basic', 'delete:basic',
  'get:admin', 'post:admin', 'patch:admin', 'delete:admin'
]

export const googleAuthorize = (scope: string) => {
  return (req: Request, res: Response, next: Function): void => {
    try {
      const { path } = req
      const { GOOGLE_ID } = process.env
      return res.redirect(
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
  return async (req: Request, res: Response, next: Function): Promise<Response> => {
    try {
      const { path, query, db } = req
      const { GOOGLE_ID, GOOGLE_SECRET, GOOGLE_OVERLORD_PROFILE_ID, JWT_SECRET } = process.env

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
    
      const data: any = (await httpClient
        .get('https://www.googleapis.com/oauth2/v1/userinfo')
        .set('accept', 'application/json')
        .query({ access_token }))
        .body
      
      let userDoc: MongooseDocument = await db['users']
        .findOne({ googleID: data.id })
        .exec()
        
      if (userDoc) return res
        .status(200)
        .json({ 
          accessToken: sign({ _id: userDoc.toObject()._id }, JWT_SECRET, { expiresIn: '2d' }),
          tokenType: 'Bearer' 
        })
      
      const { id, given_name, family_name, picture } = data
      userDoc = (await db['users']
        .create({
          googleID: id,
          permission: id == GOOGLE_OVERLORD_PROFILE_ID ? 
            ['overlord'] : 
            ['get:basic', 'post:basic', 'patch:basic', 'delete:basic'],
          photo: picture,
          firstName: given_name,
          lastName: family_name
        }))
      
      return res
        .status(201)
        .json({ 
          accessToken: sign({ _id: userDoc.toObject()._id }, JWT_SECRET, { expiresIn: '2d' }),
          tokenType: 'Bearer' 
        })
      
    } catch (error) {
      return next(error)
    }
  }
}


export default (...permissions: string[]): RequestHandler => {
  return async (req: Request, _: Response, next: Function): Promise<any> => {
    try {
      const { authorization } = req.headers
      if (!authorization) 
        return next(new JsonWebTokenError('Bearer token is required!'))
      const [ type, token ] = authorization.split(' ')
      if (type !== 'Bearer')
        return next(new JsonWebTokenError('Bearer token is required!'))

      const { _id }: any = verify(token, process.env.JWT_SECRET || '難しい鍵')
      const userDoc: MongooseDocument = await Users
        .findById(_id, { __v: 0 })
        .exec()

      if (!userDoc) 
        return next(new JsonWebTokenError('User with this token does not exist'))

      const user: IUser = userDoc.toObject()
      const scope: Array<string> = user.permissions || []
      if (!scope.some((el: string) => permissions.includes(el) || el === 'overlord'))
        return next(new PermissionError())

      req.user = user
      return next()
      
    } catch (error) {
      return next(error)
    }
  }
}