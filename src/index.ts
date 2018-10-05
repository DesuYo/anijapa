import * as dotenv from 'dotenv'
import * as http from 'http'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { join } from 'path'
import routes from './routes/users.routes'

dotenv.config()
const { PORT } = process.env

const app = express()
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

http 
  .createServer(app)
  .listen(PORT, (err: any) => {
    if (!err) {
      console.log(`SERVER RUNS ON PORT ${PORT}`)
    }
  })