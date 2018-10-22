import { Schema, model } from 'mongoose'
const GUID = Schema.Types.ObjectId

const commentSchema = new Schema({
  text: String,
  userId: { type: GUID, ref: 'User' },
  animeId: { type: GUID, ref: 'Anime' },
  likes: [{ type: GUID, ref: 'User' }],
  replies: [{ type: GUID, ref: 'Comment' }]
}, {
  timestamps: true
})

export default model('comment', commentSchema)