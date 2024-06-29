import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'

const controller = {}

controller.signup = async (req, res) => {
    await connection()
    let { username, password } = req.body
    const object = await userModels.findOne({ username : username })
    if(object === null){
        console.log('El usuario NO existe') //Renderizar pagina de usuario
        await userModels.create({ username : username, password : password }) //Anadimos el usuario a la base de datos
    } else {
        let message = 'User already exists' //Renderizar mensaje de error
        res.redirect(`/signup?message=${message}`)
    }
    res.end()
}

export default controller