import mongoose from 'mongoose'

const uri = 'mongodb+srv://victorgarciallorente20:oGMeQ2nBfc2JiGBN@cluster0.xi3nezk.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0'

const connection = () => {mongoose.connect(uri)}

export default connection