import { connect } from 'mongoose'
import models from '../models/index.model'

export default async (req, _, next) => {
  try {
    const { DB_URI } = process.env
    await connect(DB_URI, { useNewUrlParser: true })
    req.db = models
    return next()
  } catch (error) {
    return next(error)
  }
}