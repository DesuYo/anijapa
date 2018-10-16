import * as mongoDB from 'mongodb'
import * as mongoose from 'mongoose'
import { Request, Response } from 'express'
import models from '../models/index.model'

export default async (req: Request, res: Response, next: Function) => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test', { useNewUrlParser: true })
    req.db = models
    next()
  } catch (error) {
    next(error)
  }
}