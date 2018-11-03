import mongoose, { Schema } from 'mongoose'
//import {  } from '../helpers/types.import'

const ID = Schema.Types.ObjectId

const commentSchema = new Schema({
  text: String,
  userId: { type: ID, ref: 'User' },
  animeId: { type: ID, ref: 'Anime' },
  likes: [{ type: ID, ref: 'User' }],
  replies: [{ type: ID, ref: 'Comment' }]
}, {
  timestamps: true
})

export default mongoose.model('comment', commentSchema)