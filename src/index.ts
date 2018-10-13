import * as dotenv from 'dotenv'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { join } from 'path'
import routes from './routes/users.routes'
import errorsHandler from './services/errors.handler'

dotenv.config()

express()
  .set('view engine', 'pug')
  .set('views', join(__dirname, 'public', 'views'))
  .use(morgan('dev'))
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(routes)
  .use((req: express.Request, res: express.Response) => {
    res
      .status(404)
      .end()
  })
  .use(errorsHandler)
  .listen(process.env.PORT, () => console.log(`I'm gonna poop on the plate, bratok...`))

