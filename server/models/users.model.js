import mongoose, { Schema } from 'mongoose'
//import {  } from '../helpers/types.import'

export default mongoose.model('user', new Schema({
  googleID: { type: String, unique: true },
  permissions: [String],
  username: { type: String, sparse: true },
  photo: String,
  firstName: String,
  lastName: String,
  birthDate: Date
}, {
  timestamps: true
})
  .pre("save", () => {
    
  })
)