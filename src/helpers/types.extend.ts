import { Model, Document } from 'mongoose'

declare global {
  interface ICredentials {
    client_id: string
    client_secret: string
  }
  interface IOAuthConfig {
    github?: ICredentials,
    google?: ICredentials,
    [name: string]: ICredentials
  }
  namespace Express {
    interface Request {
      db: {
        [name: string]: Model<Document>
      }
      oauth: IOAuthConfig
      user: {
        _id: string
        [name: string]: any
      }
    }
  }
}
