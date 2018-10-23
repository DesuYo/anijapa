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
  .use(morgan('dev'))
  .use(cors())
  .use('/static', express.static(join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(connectionHandler)
  .get('/google', googleAuthorize('https://www.googleapis.com/auth/userinfo.profile'))
  .all('/google/callback', googleCallback())
  .use('/api', routes)
  .use((_: express.Request, res: express.Response) => {
    return res
      .status(200)
      .sendFile(join(__dirname, 'built', 'public', 'index.html'))
  })
  .use(errorsHandler)
  .listen(PORT, () => console.log(`I'm gonna poop on the plate, bratok...`))

