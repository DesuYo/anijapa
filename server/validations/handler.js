const Joi = require('joi')
const { InputValidationError, ServerError, AuthenticationError } = require('./errors')
const { compare } = require('bcryptjs')

module.exports = class { 
  constructor (input = {}) {
    this.middlewares = []
    this.input = input
  }

  async exec (callback = null) {
    try {
      for (let mw of this.middlewares) 
        this.input = await mw() || {}
      if (!callback) 
        return this.input
      return callback(this.input)
    } catch (error) {
      if (!(error instanceof InputValidationError) && !(error instanceof AuthenticationError))
        throw new ServerError(error.message || error)
      throw error
    }
  }

  addAction (callback) {
    this.middlewares.push(
      async () => callback(this.input)
    )
    return this
  }

  addUniqueValidation (collection, fields = this.input) {
    this.middlewares.push(async () => {
      const filter = Object
        .keys(fields)
        .map(key => ({ [key]: fields[key] }))
      const doc = await collection
        .findOne({ $or: filter })
      if (doc) {
        const details = Object
          .keys(doc)
          .filter(key => doc[key] === fields[key])
          .map(key => ({
            key,
            message: `Document with this <${key}> already exist`
          }))
        throw new InputValidationError(details)
      }
      return this.input
    })
    return this
  }

  addInputValidation (schema, input = this.input) {
    this.middlewares.push(async () => {
      const { error, value } = Joi
        .compile(schema)
        .options({
          abortEarly: false,
          allowUnknown: true,
          stripUnknown: true
        })
        .validate(input)
      if (error) throw new InputValidationError( 
        error.details.map(err => ({
          key: err.context.key,
          message: err.message
        }))
      )
      return value
    })
    return this
  }

  addCredentialsValidation (credentials) {
    this.middlewares.push(async () => {
      console.log(this.input)
      for (let key in credentials) 
        if (
          !this.input[key] ||
          (this.input[key] !== credentials[key] && 
          !(await compare(credentials[key], this.input[key])))
        )
          throw new AuthenticationError('Invalid credentials')
    })
    return this
  }
}
