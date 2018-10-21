import * as mongoose from 'mongoose'
import { Request, Response } from 'express'
import models from '../models/index.model'

export default async (req: Request, _: Response, next: Function) => {
  try {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env
    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true })
    req.db = models
    next()
  } catch (error) {
    next(error)
  }
}