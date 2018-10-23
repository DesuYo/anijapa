import { Model, Document } from 'mongoose'

declare global {
  interface ICredentials {
    clientID: string
    clientSecret: string
  }
  interface IOAuthConfig {
    facebook?: ICredentials
    github?: ICredentials
    google?: ICredentials
    [name: string]: ICredentials
  }
  interface IOAuthResource {
    authorizeURI: string,
    tokenURI: string,
    profileURI: string
  }
  namespace Express {
    interface Request {
      db: {
        [name: string]: Model<Document>
      }
      oauth: IOAuthConfig
      user: {
        id: string
        [name: string]: any
      }
    }
  }
}
