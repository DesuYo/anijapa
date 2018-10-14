import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
  text: String,
  userId: Schema.Types.ObjectId,
  animeId: Schema.Types.ObjectId
}, {
  timestamps: true
})

commentSchema.add({
  replyTo: [commentSchema]
})

export default model('comment', commentSchema)