import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'

const controller = {}

controller.signup = async (req, res) => {
    await connection()
    let { username, password } = req.body
    const object = await userModels.findOne({ username : username })
    if(object === null){
        console.log('El usuario NO existe') //Renderizar pagina de usuario
        await userModels.create({ username : username, password : password, friends : [], usageTime : 0, signupDate : new Date(), loginDate : new Date() , pfp : 'img/alterianimbus.png'}) //Anadimos el usuario a la base de datos
        res.render('user', {
            option : 'Chats',
            username : username,
            friends : []
        })
    } else {
        let message = 'User already exists' //Renderizar mensaje de error
        res.redirect(`/signup?message=${message}`)
    }
}

export default controller