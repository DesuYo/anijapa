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
    }
  }
}
