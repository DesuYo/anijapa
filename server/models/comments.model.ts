import { model } from 'mongoose'
import { MongooseSchema } from '../helpers/types.import'

const ID = MongooseSchema.Types.ObjectId

const commentSchema = new MongooseSchema({
  text: String,
  userId: { type: ID, ref: 'User' },
  animeId: { type: ID, ref: 'Anime' },
  likes: [{ type: ID, ref: 'User' }],
  replies: [{ type: ID, ref: 'Comment' }]
}, {
  timestamps: true
})

export default model('comment', commentSchema)