import { Router } from 'express'
import usersRoutes from './users.routes'

export default Router()
  .use('/users', usersRoutes)
