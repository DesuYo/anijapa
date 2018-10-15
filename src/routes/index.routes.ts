import { Router } from 'express'
import usersRoutes from './users.routes'
import commentsRoutes from './comments.routes'

export default Router()
  .use('/users', usersRoutes)
  .use('/comments', commentsRoutes)
