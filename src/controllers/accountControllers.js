import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'
import chatModels from '../database/models/chatModels.js'
import { makeRoom, deconstructRoom } from '../controllers/userControllers.js'

const controller = {}

controller.uploadProfilePicture = async (req, res) => {
    //Hay que usar multer para subir la imagen al servidor
    //https://es.stackoverflow.com/questions/588165/node-no-consigo-recibir-un-array-de-im%C3%A1genes-en-mi-back-proveniente-de-un-post
    //console.log(req.file)
    //console.log(req.file.path)
    let { username } = req.body
    /*res.render('image', {
        image : req.file.path.slice(6)
    })*/

    if(req.file != undefined && await userModels.findOne({ username : username }) != null){
        await connection()
        await userModels.updateOne({ username : username }, { $set : {pfp : req.file.path.slice(7)} })
        res.render('infoMessage', {
            message : 'Profile picture changed successfully',
            username : username
        })
    } else {
        res.render('infoMessage', {
            message : 'Could not change profile picture. Press back and try again',
            username : username
        })
    }
}

async function updateMessages(chat, oldUsername, newUsername) {
    let object = await chatModels.findOne({ name : chat })
    let messages = object.messages
    for(let i=0; i<messages.length; i++){
        if (messages[i].sender === oldUsername){
            messages[i].sender = newUsername
        }
    }
    console.log(messages)
    await chatModels.updateOne({ name : chat }, { $set : {messages : messages} })
}

controller.changeUsername = async (req, res) => {
    let { username, newUsername } = req.body
    let users = await userModels.find()
    let sePuedeCambiar = (await userModels.findOne({ username : newUsername }) === null)
    if(sePuedeCambiar){
        for (let i=0; i<users.length; i++){
            let object = await userModels.findOne({ username : users[i].username })
            for (let j=0; j<object.friends.length; j++){    //De cada usuario, actualizamos su lista de amigos. Si se cambia de nombre un amigo, se cambia de nombre en su lista tambien
                if(object.friends[j] === username){
                    object.friends[j] = newUsername
                    object.save('done')
                }
            }
        }
        await userModels.updateOne({ username : username }, { $set : {username : newUsername} })    //Actualizamos el nombre del usuario
        let chats = await chatModels.find()     //Actualizamos los ids de los chats
        for (let k=0; k<chats.length; k++){
            let chat = chats[k].name
            let participants = deconstructRoom(chat)
            let newRoomName = ''
            if(participants[0] === username && participants[1] === username){   //Caso de que el chat sea para hablar contigo mismo
                newRoomName = makeRoom(newUsername, newUsername)
                await updateMessages(chat, username, newUsername)
            } else if(participants[0] === username){   //Si el usuario que se cambia el nombre de usuario es miembro de esa conversacion, cambiamos el id de la conversacion
                newRoomName = makeRoom(newUsername, participants[1])
                await updateMessages(chat, username, newUsername)    //Update username in array of messages
            } else if(participants[1] === username){
                newRoomName = makeRoom(newUsername, participants[0])
                await updateMessages(chat, username, newUsername)    //Update username in array of messages
            }
            if(newRoomName != ''){
                await chatModels.updateOne({ name : chat }, { $set : {name : newRoomName} })
            }
        }
        res.redirect(`/login?message=${'Username updated succesfully. Please log in again'}`)
    } else {
        res.render('infoMessage', {
            message : 'Could not change the username. Username already taken',
            username : username
        })
    }
}

controller.changePassword = async (req, res) => {
    let { username, oldPassword, newPassword } = req.body
    console.log(username, oldPassword, newPassword)
    const object = await userModels.findOne({ username : username, password : oldPassword })
    if (object === null) {  //Contrasena incorrecta
        res.render('infoMessage', {
            message : 'Old password incorrect',
            username : username
        })
    } else {
        await userModels.updateOne({ username : username }, { $set : {password : newPassword} })
        res.render('infoMessage', {
            message : 'Password updated successfully',
            username : username
        })
    }
}

export default controller