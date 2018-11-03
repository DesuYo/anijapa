module.exports = {
  queries: {
    me: (_, __, { user }) => user,
    signIn: async (_, { account, password }, { db }) => {
      //signIn logic     
    },
    filterUsers: async (_, { emailPattern: email = '', usernamePattern: username = '', profilePattern }, { db, user }) => {
      // check permissions here or do it via directive. I dont forgot about it, bratok
      return db
        .collection('users')
        .find({ email, username, ...profilePattern })
    }
  },
  mutations: {
    signUp: async (_, args, { db }) => {
      return db
        .collection('users')
        .insertOne(args)
    }
  }
}