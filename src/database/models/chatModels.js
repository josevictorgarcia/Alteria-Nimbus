import mongoose from 'mongoose'
const { Schema } = mongoose

const chatSchema = new Schema ({
    name: String,
    messages: Array
})

const chatModels = mongoose.model('chats', chatSchema)

export default chatModels