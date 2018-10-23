import { model } from 'mongoose'
import { MongooseSchema, ObjectID } from '../helpers/types.import'

export interface IUser {
  _id: ObjectID
  googleID: string,
  permissions: string[],
  username: string,
  photo: string,
  firstName: string,
  lastName: string,
  birthDate: Date
}

export default model('user', new MongooseSchema({
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
