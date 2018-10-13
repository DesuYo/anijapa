import * as Joi from 'joi'

export const VARCHAR = (length: number) => Joi.string().trim().max(length)
export const LABEL = (length: number) => Joi.string().trim().regex(/^[a-zA-Z0-9\!\?\.\, ]*$/).max(length)
export const SLUG = (length: number) => Joi.string().trim().token().lowercase().max(length)
export const URI = (length: number) => Joi.string().trim().uri({ allowRelative: true })
export const NAME = (length: number) => Joi.string().trim().regex(/^[a-zA-Z]$/)

export const INT = Joi.number().integer()
export const UINT = Joi.number().integer().positive()
export const FLOAT = Joi.number().precision(3)
export const UFLOAT = Joi.number().precision(3).positive()

export const DATE = Joi.date().iso()
export const PHONE = Joi.string().trim().replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/)
export const EMAIL = Joi.string().trim().email()
