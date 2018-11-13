const { gql } = require('apollo-server-express')

module.exports = gql `
  type Comment {
    id: ID!
    userID: ID!
    text: String!
    updatedAt: String!
  }

  type Like {
    id: ID!
    userId: ID!
    commentId: ID!
  }

  type Episode {
    id: ID!
    dubbers: [String!]
    sequenceNumber: Int!
    description: String
  }
`