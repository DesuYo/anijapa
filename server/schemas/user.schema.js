const { gql } = require('apollo-server-express')

module.exports = gql`
  type User {
    id: ID!
    isBanned: Boolean!
    email: String! @unique
    username: String! @unique
    googleID: ID
    facebookID: ID
    photo: String
    firstName: String
    lastName: String
    birthday: String
    #comments: [Comment!]
  }

  type AccessInfo {
    accessToken: String!
    refreshToken: String!
  }

  input UserProfileInput {
    photo: String
    firstName: String
    lastName: String
    birthday: String
  }

  extend type Query {
    me: User!
    signIn (account: String!, password: String!): AccessInfo
    # only for admins
    filterUsers (emailPattern: String, usernamePattern: String, profilePattern: UserProfileInput): [User]!
    findUser (id: ID!): User
  }

  extend type Mutation {
    signUp (password: String!, email: String!, username: String!): AccessInfo
    patchMe (username: String, profile: UserProfileInput): User!
    deleteMe (password: String): Boolean
    # only for admins
    banUser (id: ID!): Boolean!
  }
`
