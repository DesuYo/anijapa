const Joi = require('joi')
const { InputValidationError, ServerError, AuthError } = require('./errors')
const { compare } = require('bcryptjs')
const _ = require('lodash')
const { splitObject, resolveArguments } = require('./helpers')

module.exports = class { 
  constructor (model, input = null, backend = 'mongoDB') {
    this.model = model
    this.backend = backend
    this.data = [].concat(input)
    this.middlewares = []
  }

  async exec (callback = null) {
    try {
      for (let mw of this.middlewares) 
        this.data.push(await mw() || null)
      console.log(this.data)
      if (!callback) 
        return this.data
      return callback(this.data)
    } catch (error) {
      console.log(error)
      if (!(error instanceof InputValidationError) && !(error instanceof AuthError))
        throw new ServerError(error.message || error)
      throw error
    }
  }

  insert (docs = {}, model = this.model) {
    this.middlewares.push(async () => {
      docs = resolveArguments(this.data, docs)[0]
      docs = docs instanceof Array ? docs : [docs]
      switch (this.backend) {
        case 'mongoDB':
        case 'mongoose':
          return await model.insertMany(docs)
      }
    })
    return this
  }

  select (filter = {}, stopOnFirst = false, model = this.model) {
    this.middlewares.push(async () => {
      const args = resolveArguments(this.data, filter)
      switch (this.backend) {
        case 'mongoDB': return stopOnFirst
          ? await model.findOne(...args)
          : await model.find(...args).toArray()
        case 'mongoose': return stopOnFirst
          ? await model.findOne(...args).exec()
          : await model.find(...args).exec()
      }
    })
    return this
  }

  update (filter = {}, fields = {}, stopOnFirst = false, model = this.model) {
    this.middlewares.push(async () => {
      const args = resolveArguments(this.data, filter, fields)
      switch (this.backend) {
        case 'mongoDB': return stopOnFirst 
          ? await model.updateOne(...args)
          : await model.updateMany(...args)
        case 'mongoose': return stopOnFirst
          ? await model.updateOne(...args).exec()
          : await model.updateMany(...args).exec()
      }
    })
    return this
  }

  patch (filter = {}, fields = {}, stopOnFirst = false, model = this.model) {
    this.middlewares.push(async () => {
      const args = resolveArguments(this.data, filter, fields)
      switch (this.backend) {
        case 'mongoDB': return stopOnFirst
          ? await model.updateOne(args[0], { $set: args[1] })
          : await model.updateMany(args[0], { $set: args[1] })
        case 'mongoose': return stopOnFirst
          ? await model.updateOne(args[0], { $set: args[1] }).exec()
          : await model.updateMany(args[0], { $set: args[1] }).exec()
      }
    })
    return this
  }

  delete (filter = {}, stopOnFirst = false, model = this.model) {
    this.middlewares.push(async () => {
      const args = resolveArguments(this.data, filter)
      switch (this.backend) {
        case 'mongoDB': return stopOnFirst
          ? await model.deleteOne(...args)
          : await model.deleteMany(...args)
        case 'mongoose': return stopOnFirst
          ? await model.deleteOne(...args).exec()
          : await model.deleteMany(...args).exec()
      }
    })
    return this
  }

  addSchema (schema, fields = {}) {
    this.middlewares.push(async () => {
      const { error, value } = Joi
        .compile(schema)
        .options({
          abortEarly: false,
          allowUnknown: true,
          stripUnknown: true
        })
        .validate(...resolveArguments(this.data, fields))
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

  addUniqueFields (fields = {}, model = this.model) {
    this.middlewares.push(async () => {
      let doc = null
      const args = resolveArguments(this.data, fields)
      switch (this.backend) {
        case 'mongoDB': 
          doc = await model.findOne({ $or: splitObject(args[0]) })
          break
        case 'mongoose': 
          doc = await model.findOne({ $or: splitObject(args[0]) }).exec()
          break
      }
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

  compare (values = {}, doc = {}, error) {
    this.middlewares.push(async () => {
      const args = resolveArguments(this.data, values, doc)
      for (let key in args[0])
        if (
          !args[1][key] ||
          (args[1][key] !== args[0][key] && 
          !(await compare(args[0][key], args[1][key])))
        )
          throw error
      return null
    })
    return this
  }

  addAction (callback) {
    this.middlewares.push(
      async () => callback(this.output)
    )
    return this
  }
}
