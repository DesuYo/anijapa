import * as dotenv from 'dotenv'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { join } from 'path'
import connectionHandler from './services/db.connection'
import { initOAuthClient, authorize, callback } from './services/auth.handler'
import routes from './routes/index.routes'
import errorsHandler from './services/errors.handler'

dotenv.config()
const { PORT = 777, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

export default express()
  .set('view engine', 'pug')
  .set('views', join(__dirname, 'public', 'views'))
  .use(morgan('dev'))
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(connectionHandler)
  .use(initOAuthClient({
    github: {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET
    }
  }))
  .use('/oauth/github', authorize('github', `http://localhost:${PORT}/oauth/github/callback`))
  .use('/oauth/github/callback', callback('github'))
  .use('/api', routes)
  .use((req: express.Request, res: express.Response) => {
    res
      .status(404)
      .end()
  })
  .use(errorsHandler)
  .listen(PORT, () => console.log(`I'm gonna poop on the plate, bratok...`))

