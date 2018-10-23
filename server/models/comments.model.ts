import { model } from 'mongoose'
import { MongooseSchema, ObjectID } from '../helpers/types.import'

const commentSchema = new MongooseSchema({
  text: String,
  userId: { type: ObjectID, ref: 'User' },
  animeId: { type: ObjectID, ref: 'Anime' },
  likes: [{ type: ObjectID, ref: 'User' }],
  replies: [{ type: ObjectID, ref: 'Comment' }]
}, {
  timestamps: true
})

export default model('comment', commentSchema)