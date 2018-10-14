import { Request, Response, RequestHandler } from 'express'
import * as Joi from 'joi'

const STR = (maxLength: number) => Joi.string().trim().max(maxLength)
const NUM = (max: number) => Joi.number().max(max)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/

export const VARCHAR = (maxLength: number, def: string = undefined) => STR(maxLength).default(def)
export const $VARCHAR = (maxLength: number) => STR(maxLength).required()

export const GUID = (def: string = undefined) => STR(64).guid().default(def)
export const $GUID = () => STR(64).guid().required()

export const ARRAY = (type: Joi.SchemaLike, def: Array<any> = undefined) => Joi.array().items(type).default(def)
export const $ARRAY = (type: Joi.SchemaLike) => Joi.array().items(type).required()

export const SLUG = (maxLength: number, def: string = undefined) => STR(maxLength).token().lowercase().default(def)
export const $SLUG = (maxLength: number) => STR(maxLength).token().lowercase().required()

export const URI = (maxLength: number, def: string = undefined) => STR(maxLength).uri({ allowRelative: true }).default(def)
export const $URI = (maxLength: number) => STR(maxLength).uri({ allowRelative: true }).required()

export const NAME = (maxLength: number, def: string = undefined) => STR(maxLength).regex(/^[a-zA-Z]$/).default(def)
export const $NAME = (maxLength: number) => STR(maxLength).regex(/^[a-zA-Z]$/).required()

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

export const FLOAT = (max: number = 2**32, precision: number = 3, def: number = undefined) => NUM(max).precision(precision).default(def)
export const $FLOAT = (max: number = 2**32, precision: number = 3) => NUM(max).precision(precision).required()

export const UFLOAT = (max: number = 2**32, precision: number = 3, def: number = undefined) => NUM(max).precision(precision).positive().default(def)
export const $UFLOAT = (max: number = 2**32, precision: number = 3) => NUM(max).precision(precision).positive().required()

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
