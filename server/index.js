const { join } = require('path') 
const dotenv = require('dotenv')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
const morgan = require('morgan')
const cors = require('cors')
const typeDefs = require('./schemas/index.schema')
const resolvers = require('./resolvers/index.resolvers')
//const schemaDirectives = require('./directives/index.directive')

;(async () => {
  try {
    dotenv.config()
    const { PORT, NODE_ENV, MONGO_URI, DB_NAME } = process.env
    const mongoClient = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true })
    const db = mongoClient.db(DB_NAME)
    const app = express()
      .set('view engine', 'pug')
      .set('views', 'pages')
      .use(morgan('dev'))
      .use(cors())
      .disable('x-powered-by')
      .get('/static', express.static(join(__dirname, 'built', 'public')))
      //.get('/', (_, res) => res.sendFile(join(__dirname, 'public')))

    const graph = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        user: req.user,
        db
      }),
      formatError: ({ message, extensions }) => {
        return {
          message,
          status: extensions.exception.status,
          details: extensions.exception.details
        }
      },
      playground: NODE_ENV === 'dev'
    })
    graph.applyMiddleware({ app, path: '/graph' })
      
    app.listen(PORT || 777, () => console.log('ooooi, I am gonna poop on the plate...'))
  } catch (error) {
    console.log(error)
  }
})()
