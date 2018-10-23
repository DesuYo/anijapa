import { MongooseDocument, MongooseModel, MongooseDocumentID } from './types.import'

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
        [name: string]: MongooseModel<MongooseDocument>
      }
      oauth: IOAuthConfig
      user: {
        _id: MongooseDocumentID
        [name: string]: any
      }
    }
  }
}
