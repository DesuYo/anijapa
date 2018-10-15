import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  animeId: { type: Schema.Types.ObjectId, required: true },
  likes: [Schema.Types.ObjectId]
}, {
  timestamps: true
})

commentSchema
  .add({
    replyTo: [commentSchema]
  })

export default model('comment', commentSchema)