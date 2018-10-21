import { Schema, model } from 'mongoose'

export default model('user', new Schema({
  googleID: { type: String, unique: true },
  username: { type: String, unique: true },
  firstName: String,
  lastName: String,
  birthDate: Date,
  photo: String
}, {
  timestamps: true
})
  .pre("save", () => {
    
  })
)
