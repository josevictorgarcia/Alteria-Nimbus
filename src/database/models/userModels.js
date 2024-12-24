import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema ({
    username: String,
    name: String,           //username es el identificador unico del usuario (bien sea correo o nombre de usuario) mientras que name es el nombre publico que los demas usuarios veran. En el caso de los usuarios con provider 'app', username y name siempre coincidirán.
    password: String,
    friends: Array,
    usageTime: Number,
    signupDate: Date,
    loginDate: Date,
    pfp : String,
    role : String,
    provider: String
})

const userModels = mongoose.model('users', userSchema)

export default userModels