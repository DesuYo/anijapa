import * as Joi from 'joi'
import * as _ from './types.schema'

export const createUserSchema = Joi
  .object({
    username: _.SLUG(16),
    email: _.EMAIL,
    password: _.VARCHAR(64).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  })
  .requiredKeys('username', 'email', 'password')

export const patchUserSchema = Joi
  .object({
    password: _.VARCHAR(256),
    username: _.SLUG(16),
    firstName: _.NAME(16),
    lastName: _.NAME(16),
    birthDate: _.DATE,
    photo: _.URI(256)
  })
  .requiredKeys('password')

