import * as Joi from 'joi'

const createUser = Joi
  .object({
    username: Joi.string().min(2).max(15).alphanum(),
    email: Joi.string().max(50).email(),
    password: Joi.string().max(50).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/)
  })
  .requiredKeys('username', 'email', 'password')
  .options({
    abortEarly: false,
    allowUnknown: true
  })

const patchUser = Joi.object({
  password: Joi.string(),
  username: Joi.string().min(2).max(15).alphanum(),
  firstName: Joi.string().
}).requiredKeys('password')

