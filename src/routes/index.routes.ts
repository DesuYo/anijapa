import { Router } from 'express'
import usersRoutes from './users.routes'
import commentsRoutes from './comments.routes'

export default Router()
  .use('/users', usersRoutes)
  .use('/anime/:animeId/comments', commentsRoutes)
