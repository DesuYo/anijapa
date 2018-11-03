const { gql } = require('apollo-server-express')
const User = require('./user.schema')


module.exports = [
  gql`
    type Query { _: Int },
    type Mutation { _: Int },
    type Subscription { _: Int }
  `,
  User
]
