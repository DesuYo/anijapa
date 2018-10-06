import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { join } from 'path'
import routes from './routes/users.routes'
import { config } from 'dotenv'

config()

express()
  .set('view engine', 'pug')
  .set('views', join(__dirname, 'public', 'views'))
  .use(morgan('dev'))
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(routes)
  .use((req: express.Request, res: express.Response) => {
    res.status(404).end()
  })
  .listen(777, () => { 
    console.log('Listen listen')
  })
