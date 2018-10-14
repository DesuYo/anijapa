import { Request, Response, RequestHandler } from 'express'
import * as Joi from 'joi'

const STR = (length: number) => Joi.string().trim().max(length)
const NUM = (max: number) => Joi.number().max(max)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/

export const VARCHAR = (length: number, def: string = undefined) => STR(length).default(def)
export const $VARCHAR = (length: number) => STR(length).required()

export const SLUG = (length: number, def: string = undefined) => STR(length).token().lowercase().default(def)
export const $SLUG = (length: number) => STR(length).token().lowercase().required()

export const URI = (length: number, def: string = undefined) => STR(length).uri({ allowRelative: true }).default(def)
export const $URI = (length: number) => STR(length).uri({ allowRelative: true }).required()

export const NAME = (length: number, def: string = undefined) => STR(length).regex(/^[a-zA-Z]$/).default(def)
export const $NAME = (length: number) => STR(length).regex(/^[a-zA-Z]$/).required()

export const EMAIL = (def: string = undefined) => STR(64).email().default(def)
export const $EMAIL = () => STR(64).email().required()

export const PHONE = (def: string = undefined) => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).default(def)
export const $PHONE = () => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).required()

export const PASSWORD = (minLength: number, def: string = undefined) => STR(64).regex(passwordRegex).min(minLength).default(def)
export const $PASSWORD = (minLength: number) => STR(64).regex(passwordRegex).min(minLength).required()

export const INT = (max: number = 2**32, def: number = undefined) => NUM(max).integer().default(def)
export const $INT = (max: number = 2**32) => NUM(max).integer().required()

export const UINT = (max: number = 2**32, def: number = undefined) => NUM(max).integer().positive().default(def)
export const $UINT = (max: number = 2**32) => NUM(max).integer().positive().required()

export const FLOAT = (max: number = 2**32, precision: number, def: number = undefined) => NUM(max).precision(precision).default(def)
export const $FLOAT = (max: number = 2**32, precision: number) => NUM(max).precision(precision).required()

export const UFLOAT = (max: number = 2**32, precision: number, def: number = undefined) => NUM(max).precision(precision).positive().default(def)
export const $UFLOAT = (max: number = 2**32, precision: number) => NUM(max).precision(precision).positive().required()

export const BOOL = (def: boolean = undefined) => Joi.boolean().default(def)

export const DATE = (def: Date = undefined) => Joi.date().iso().default(def)
export const $DATE = () => Joi.date().iso().required()

export const validationsHandler = (sample: Joi.SchemaLike): RequestHandler => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const { error, value } = Joi.compile(sample)
        .options({
          abortEarly: false,
          allowUnknown: true,
          stripUnknown: true
        })
        .validate(req.body)
        
      if (error) next(error)
      
      req.body = value
      return next()
      
    } catch (error) {
      next(error)
    }
  }
}
