import { Schema, model } from 'mongoose'

export default model('user', new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
}, {
  timestamps: true
})
  .pre("save", () => {
    
  })
)
const customSchema = new Schema({ a: String })
customSchema.add({ b: [customSchema] })