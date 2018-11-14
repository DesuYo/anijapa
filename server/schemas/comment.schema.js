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

  extend type Query {
    #only for admins
    filterComments(userId: ID, username: String, text: String): [Comment]!
  }

  extend type Mutation {
    postComment (userId: ID!, text: String!): Comment
    patchComment (userId: ID!): Comment!
    deleteComment(userId: ID!, commentId: ID!): Boolean
  }
`