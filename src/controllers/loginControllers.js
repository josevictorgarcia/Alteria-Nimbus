import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'

const controller = {}

controller.getSignUpPage = (req, res) => {
    let message = req.query.message
    res.render('signup', {
        message : message
    })
}

controller.login = async (req, res) => {//cambiar el html pulsar boton login
    await connection()
    //const users = await userModels.find()   //Si da error timeout 10000ms comprobar direcciones ip que tienen acceso a la base de datos (mongodb.com-->security-->network access)
    //console.log(users)
    let { username, password } = req.body
    const object = await userModels.findOne({ username : username, password : password })
    console.log(object)
    if(object === null){
        let message = 'Username or password not valid'  //Renderizar mensaje de error
        res.redirect(`/login?message=${message}`)
    } else {
        console.log('El usuario existe')    //Renderizar pagina de usuario
        res.render('user', {
            option : 'Select option',
            username : object.username,
            friends : object.friends
        })
    }
}

export default controller