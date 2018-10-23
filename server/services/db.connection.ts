import * as mongoose from 'mongoose'
import models from '../models/index.model'
import { Request, Response } from '../helpers/types.import'

export default async (req: Request, _: Response, next: Function): Promise<any> => {
  try {
    const { DB_URI } = process.env
    await mongoose.connect(DB_URI, { useNewUrlParser: true })
    req.db = models
    return next()
  } catch (error) {
    return next(error)
  }
}