import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'

const controller = {}

controller.getSignUpPage = (req, res) => {
    let message = req.query.message
    res.render('signup', {
        message : message
    })
}

async function getFriendsAndPictures(object){
    let friendsAndPictures = []
    for(let i=0; i<object.friends.length; i++){
        let friendObject = await userModels.findOne({ username : object.friends[i] })
        if(friendObject != null){
            friendsAndPictures.push({ friendUsername : friendObject.username, friendName : friendObject.name, pfp : friendObject.pfp })
        }
    }
    return friendsAndPictures
}

controller.login = async (req, res) => {        //cambiar el html pulsar boton login
    await connection()
    //const users = await userModels.find()     //Si da error timeout 10000ms comprobar direcciones ip que tienen acceso a la base de datos (mongodb.com-->security-->network access)
    //console.log(users)
    let { username, password } = req.body
    const object = await userModels.findOne({ username : username, password : password })
    //console.log(object)
    if(object === null){
        let message = 'Username or password not valid'  //Renderizar mensaje de error
        res.redirect(`/login?message=${message}`)
    } else {
        console.log('El usuario existe')    //Renderizar pagina de usuario
        await  userModels.updateOne({ username : username }, { $set : {loginDate : new Date()} })
        let friendsAndPictures = await getFriendsAndPictures(object)
        //console.log(friendsAndPictures)
        res.render('user', {
            option : 'Chats',
            username : object.username,
            friendsAndPictures : friendsAndPictures
        })
    }
}


controller.loginGoogle = async(req, res) => {
    await connection()
    const object = await userModels.findOne({ username : req.query.username })
    if(object === null){    //Si no existe lo añadimos a la BBDD
        await userModels.create({ username : req.query.username, name : req.query.name, password : null, friends : [], usageTime : 0, signupDate : new Date(), loginDate : new Date() , pfp : req.query.pfp, provider: 'google'}) //Anadimos el usuario a la base de datos
    } else {                //Si existe lo actualizamos
        await  userModels.updateOne({ username : req.query.username }, { $set : {loginDate : new Date(), name : req.query.name, pfp : req.query.pfp} })
    }
    res.end()
}

export default controller
export { getFriendsAndPictures }