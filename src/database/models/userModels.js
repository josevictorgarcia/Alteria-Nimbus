import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema ({
    username: String,
    password: String
})

const userModels = mongoose.model('users', userSchema)

export default userModels