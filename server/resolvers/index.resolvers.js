const user = require('./user.resolver')

module.exports = {
  Query: {
    ...user.queries
  },
  Mutation: {
    ...user.mutations
  }
}