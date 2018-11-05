const { $SLUG, $EMAIL, $PASSWORD } = require('../validations/types')
const Chainer = require('../validations/handler')
const jwt = require('jsonwebtoken')

module.exports = {
  queries: {
    me: (_, __, { user }) => user,
    signIn: async (_, { account, password }, { db }) => {
      const users = db.collection('users')
      return new Chainer({ account, password })
        .addAction(({ account }) => users.findOne({
          $or: [{ email: account }, { username: account }]
        }))
        //in proccess
    }
  },
  mutations: {
    signUp: async (_, { email, username, ...rest }, { db }) => {
      const users = db.collection('users')
      return new Chainer({ email, username, ...rest })
        .addInputValidation({
          password: $PASSWORD(8),
          email: $EMAIL(),
          username: $SLUG(16)
        })
        .addUniqueValidation(users, { email, username })
        .addAction(user => users.insertOne(user))
        .exec(({ insertedId }) => ({ 
          accessToken: jwt.sign({ insertedId }, process.env.JWT_SECRET, { expiresIn: '2h' }),
          refreshToken: jwt.sign({ insertedId }, process.env.JWT_SECRET)
        }))
    }
  }
}