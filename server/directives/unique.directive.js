const { SchemaDirectiveVisitor } = require('apollo-server-express')
const { GraphQLDirective, DirectiveLocation } = require('graphql')

module.exports = class UniqueDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration () {
    return new GraphQLDirective({
      name: 'unique',
      locations: [DirectiveLocation.FIELD_DEFINITION]
    })
  }
  
  visitFieldDefinition (field, { objectType }) {
    const { resolve, name } = field
    field.resolve = async (...args) => {
      const [parent, _, { db }] = args
      const record = await db
        .collection(objectType.name + 's')
        .findOne({ [name]: parent[name] })
      if (record)
        throw Error(`${objectType.name} with this ${name} is already exist`)
      return await resolve.apply(this, args)
    }
  }
}