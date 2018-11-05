const Joi = require('joi')
const { InputValidationError, ServerError } = require('./errors')

module.exports = class { 
  constructor (input = {}) {
    this.middlewares = []
    this.input = input
    this.output = input
  }

  async exec (callback = null) {
    try {
      for (let mw of this.middlewares) 
        this.output = await mw() || this.output
      if (!callback) 
        return this.output
      return callback(this.output)
    } catch (error) {
      if (!(error instanceof InputValidationError))
        throw new ServerError(error.message || error)
      throw error
    }
  }

  addAction (callback) {
    this.middlewares.push(
      async () => callback(this.output)
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

}
