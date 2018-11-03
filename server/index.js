const { join } = require('path') 
const dotenv = require('dotenv')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const mongodb = require('mongodb')
const morgan = require('morgan')
const cors = require('cors')
const typeDefs = require('./schemas/index.schema')
const resolvers = require('./resolvers/index.resolvers')
const schemaDirectives = require('./directives/index.directive')

;(async () => {
  try {
    dotenv.config()
    const { PORT, NODE_ENV, DB_URI } = process.env
    await mongodb.connect(DB_URI, { useNewUrlParser: true })
    const app = express()
      .set('view engine', 'pug')
      .set('views', 'pages')
      .use(morgan('dev'))
      .use(cors())
      .disable('x-powered-by')
      .get('/static', express.static(join(__dirname, 'built', 'public')))
      .get('/', (_, res) => res.sendFile(join(__dirname, 'public')))

    new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      context: ({ req }) => ({
        user: req.user
      }),
      playground: NODE_ENV === 'dev'
    })
      .applyMiddleware({ app })
      
    app.listen(PORT || 777, () => console.log('ooooi, I am gonna poop on the plate...'))
  } catch (error) {
    console.log(error)
  }
})()
