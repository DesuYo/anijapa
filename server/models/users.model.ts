import { Schema, model } from 'mongoose'

export default model('user', new Schema({
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
