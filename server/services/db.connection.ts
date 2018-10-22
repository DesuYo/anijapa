import * as mongoose from 'mongoose'
import { Request, Response } from 'express'
import models from '../models/index.model'

export default async (req: Request, _: Response, next: Function) => {
  try {
    const { DB_URI } = process.env
    await mongoose.connect(DB_URI, { useNewUrlParser: true })
    req.db = models
    next()
  } catch (error) {
    next(error)
  }
}