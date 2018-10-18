import { Model, Document } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      db: {
        [name: string]: Model<Document>
      }
      user: {
        _id: string
        [name: string]: any
      }
    }
  }
}
