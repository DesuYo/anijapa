const { $SLUG, $EMAIL, $PASSWORD } = require('../data_flow/types')
const DataFlow = require('../data_flow/handler')
const { AuthError } = require('../data_flow/errors')
const jwt = require('jsonwebtoken')

module.exports = {
  queries: {
    me: (_, __, { user }) => user,
    signIn: async (_, { account, password }, { db }) => {
      return new DataFlow(db.collection('users')) // 0
        .select({ $or: [{ email: account }, { username: account }] }, true) // 1
        .compare({ password }, data => ({ password: data[1].password }), new AuthError()) // 2
        .exec(data => ({
          accessToken: jwt.sign({ id: data[1]._id }, process.env.JWT_SECRET, { expiresIn: '2h' }),
          refreshToken: jwt.sign({ id: data[1]._id }, process.env.JWT_SECRET)
        }))
    }
  },
  mutations: {
    signUp: async (_, { email, username, password }, { db }) => {
      return new DataFlow(db.collection('users')) // 0
        .addSchema({ // 1
          password: $PASSWORD(8),
          email: $EMAIL(),
          username: $SLUG(16)
        }, args)
        .addUniqueFields({ email, username }) // 2
        .insert(data => data[1]) // 3
        .exec(data => ({
          accessToken: jwt.sign({ id: data[3].insertedId }, process.env.JWT_SECRET, { expiresIn: '2h' }),
          refreshToken: jwt.sign({ id: data[3].insertedId }, process.env.JWT_SECRET)
        }))
    }
  }
}