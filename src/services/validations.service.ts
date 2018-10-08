<<<<<<< HEAD
import * as Joi from 'joi'

export default (sample: object, schema: Joi.Schema): object => {
  try {
    const { error, value } = Joi.validate(sample, schema)
    if (error) {
      throw error.details.map((err: Joi.ValidationErrorItem) => ({
        key: err.context.key,
        message: err.message
      }))
    }
    else return value
  } catch (error) {
    throw {
      status: 400,
      details: error
=======
import { Request, Response, RequestHandler } from 'express'
import { Schema, ValidationErrorItem } from 'joi'

module.exports = (sample: Schema): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { error, value } = sample
        .options({
          abortEarly: false,
          allowUnknown: true
        })
        .validate(req.body)

      if (error) return res
        .status(400)
        .json(error.details.map((err: ValidationErrorItem) => ({
          key: err.context.key,
          message: err.message
        })))
      
      else {
        req.body = value
        return next()
      }

    } catch (error) {
      
>>>>>>> 1046561eba945e3d863c02954b0a4d42d847aa8d
    }
  }
}
