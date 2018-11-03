import * as Joi from 'joi'

const STR = (maxLength) => Joi.string().trim().max(maxLength)
const NUM = (max) => Joi.number().max(max)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

export const VARCHAR = (maxLength, def = undefined) => STR(maxLength).default(def)
export const $VARCHAR = (maxLength) => STR(maxLength).required()

export const GUID = (def = undefined) => STR(64).guid().default(def)
export const $GUID = () => STR(64).guid().required()

export const ARRAY = (...type) => Joi.array().items(type).default([])
export const $ARRAY = (...type) => Joi.array().items(type).required()

export const ENUM = (...values) => Joi.allow(values)
export const $ENUM = (...values) => Joi.allow(values).required()

export const SLUG = (maxLength, def = undefined) => STR(maxLength).token().lowercase().default(def)
export const $SLUG = (maxLength) => STR(maxLength).token().lowercase().required()

export const URI = (maxLength, def = undefined) => STR(maxLength).uri({ allowRelative: true }).default(def)
export const $URI = (maxLength) => STR(maxLength).uri({ allowRelative: true }).required()

export const NAME = (maxLength, def = undefined) => STR(maxLength).regex(/^[a-zA-Z]$/).default(def)
export const $NAME = (maxLength) => STR(maxLength).regex(/^[a-zA-Z]$/).required()

export const EMAIL = (def = undefined) => STR(64).email().default(def)
export const $EMAIL = () => STR(64).email().required()

export const PHONE = (def = undefined) => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).default(def)
export const $PHONE = () => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).required()

export const PASSWORD = (minLength, def = undefined) => STR(64).regex(passwordRegex).min(minLength).default(def)
export const $PASSWORD = (minLength) => STR(64).regex(passwordRegex).min(minLength).required()

export const INT = (max = 2**32, def = undefined) => NUM(max).integer().default(def)
export const $INT = (max = 2**32) => NUM(max).integer().required()

export const UINT = (max = 2**32, def = undefined) => NUM(max).integer().positive().default(def)
export const $UINT = (max = 2**32) => NUM(max).integer().positive().required()

export const FLOAT = (max = 2**32, precision = 3, def = undefined) => NUM(max).precision(precision).default(def)
export const $FLOAT = (max = 2**32, precision = 3) => NUM(max).precision(precision).required()

export const UFLOAT = (max = 2**32, precision = 3, def = undefined) => NUM(max).precision(precision).positive().default(def)
export const $UFLOAT = (max = 2**32, precision = 3) => NUM(max).precision(precision).positive().required()

export const BOOL = (def = undefined) => Joi.boolean().default(def)

export const DATE = (def = undefined) => Joi.date().iso().default(def)
export const $DATE = () => Joi.date().iso().required()

export const validationHandler = (sample) => {
  return async (req, _, next) => {
    try {
      const { error, value } = Joi
        .compile(sample)
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
