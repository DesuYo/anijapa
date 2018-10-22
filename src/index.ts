import * as dotenv from 'dotenv'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { join } from 'path'
import connectionHandler from './services/db.connection'
import { googleAuthorize, googleCallback } from './services/auth.handler'
import routes from './routes/index.routes'
import errorsHandler from './services/errors.handler'

dotenv.config()
const { PORT = 777 } = process.env

export default express()
  .set('view engine', 'pug')
  .set('views', join(__dirname, 'public', 'views'))
  .use(morgan('dev'))
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(connectionHandler)
  .get('/google', googleAuthorize('https://www.googleapis.com/auth/userinfo.profile'))
  .all('/google/callback', googleCallback())
  .use('/api', routes)
  .use((req: express.Request, res: express.Response) => {
    res
      .status(404)
      .end()
  })
  .use(errorsHandler)
  .listen(PORT, () => console.log(`I'm gonna poop on the plate, bratok...`))

