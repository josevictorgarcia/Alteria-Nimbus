import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'
import chatModels from '../database/models/chatModels.js'
import { getFriendsAndPictures } from './loginControllers.js'

const controller = {}

controller.addFriend = async (req, res) => {
    await connection()
    let object = await userModels.findOne({ username : req.query.username })
    let friend = await userModels.findOne({ username : req.query.friend })

    let room = makeRoom(req.query.username, req.query.friend)

    if (friend === null){   //Significa que el amigo no existe
        res.send(false)
    } else {
        if(object === null){
            res.send("error")
        }
        else if(object.friends.indexOf(req.query.friend) == -1){
            if (await chatModels.findOne({ name : room }) === null){    //Asi evitamos que salga un chat con id duplicado y vacio en la base de datos
                await chatModels.create({ name : room, messages : [] })
            }
            object.friends.push(req.query.friend)
            object.save('done')
            res.send(true)
        } else {
            res.send("duplicated")
        }
    }
}

function makeRoom(username, friend) {
    let room = ''
    if(username<friend){
        room = username.concat('UiL.').concat(friend)
    } else{
        room = friend.concat('UiL.').concat(username)
    }
    room = room.concat("ay&27ffcGYiY")
    room = "3B9g3D8V".concat(room)
    return room
}

function deconstructRoom(room){
    let dosCadenas = room.split('UiL.')
    let string1 = dosCadenas[0].slice(8)
    let string2 = dosCadenas[1].slice(0, -12)
    return [string1, string2]
}

function setMessageStyle(message, username){
    if(message.sender == username) {
        message.messageBox = 'usernameMessage'
        message.pictureAndName = 'usernamePictureAndName'
        message.messageText = 'usernameMessageText'
    } else {
        message.messageBox = 'friendMessage'
        message.pictureAndName = 'friendPictureAndName'
        message.messageText = 'friendMessageText'
    }
}

controller.reloadPage = async (req, res) => {
    await connection()
    let object = await userModels.findOne({ username : req.query.username })
    if(object === null) {   //Si el objeto no existe
        res.redirect(`/login?message=${'An error occurred. Please log in again'}`)
        /*res.render('infoMessage', {
            message : 'An error occurred. Please log in again',
            username : 'None'   //Username no sirve para nada, se podria quitar
        })*/
    } else {
        let friendsAndPictures = await getFriendsAndPictures(object)
        res.render('user', {
            option : 'Chats',
            username : object.username,
            friendsAndPictures : friendsAndPictures
        })
    }
}

controller.getChatBox = async (req,res) => {
    res.render('chatBox', {
        username : req.query.username,
        friend : req.query.friend
    })
}

controller.getChatMessages = async (req, res) => {
    let username = req.query.username
    let room = makeRoom(req.query.username, req.query.friend)

    await connection()
    let object = await chatModels.findOne({ name : room })
    //console.log(object)
    //res.json(object.messages)
    if(object === null) {   //Si el objeto no existe
        res.render('message', {
            messages : [ { sender : 'Alteria Nimbus', message : 'An error occurred. Please log in again'} ]
        })
    } else {    //Comprobar si funciona
        for (let i=0; i<object.messages.length; i++) {
            let message = object.messages[i]
            setMessageStyle(message, username)
        }
        res.render('message', {
            messages : object.messages,
        })
    }
}

controller.saveMessage = async (req, res) => {
    let room = makeRoom(req.query.username, req.query.friend)
    let message = { message : req.query.message, sender : req.query.username }

    await connection()
    let object = await chatModels.findOne({ name : room })
    if(object != null){
        object.messages.push(message)
        object.save('done')
    }
    res.end()
}

controller.printMessage = async (req, res) => {
    let message = { message : req.query.message, sender : req.query.username }
    setMessageStyle(message, req.query.receiver)
    res.render('message', {
        messages : message
    })
}

async function getNumFriends(username){
    await connection()
    let object = await userModels.findOne({ username : username })
    return object
}

async function getNumMessages(username){
    await connection()
    let object = await userModels.findOne({ username : username })
    let max = -1
    let bestFriend = "You have no friends"
    let totalMessages = 0
    for(let i=0; i<object.friends.length; i++){
        let friend = object.friends[i]
        let chatName = makeRoom(username, friend)
        let object2 = await chatModels.findOne({ name : chatName })
        totalMessages += object2.messages.length
        if(object2.messages.length >= max){
            max = object2.messages.length
            bestFriend = friend
        }
    }
    return { bestFriend, totalMessages }
}

controller.getAccountPage = async (req, res) => {
    let { username } = req.body
    let userObject = await getNumFriends(username)
    if (userObject === null){   //Si el objeto no existe
        res.render('infoMessage', {
            message : 'An error occurred. Please log in again',
            username : username
        })
    } else {
        let statsMessages = await getNumMessages(username)
        let signupDate = userObject.signupDate.toLocaleString("en-GB")
        let loginDate = userObject.loginDate.toLocaleString("en-GB")
        let pfp = userObject.pfp
        res.render('account', {
            username : username,
            numFriends : userObject.friends.length,
            bestFriend : statsMessages.bestFriend,
            numMessages : statsMessages.totalMessages,
            usageTime : userObject.usageTime,
            signupDate : signupDate,
            loginDate : loginDate,
            pfp : pfp
        })
    }
}

controller.updateUsageTime = async (req, res) => {
    await connection()
    let time = parseInt(req.query.time)
    let seconds = (time / 1000).toFixed(0)
    await userModels.updateOne({ username : req.query.username }, { $inc : {usageTime : seconds} })
    //object.usageTime += seconds           //No funciona con estas dos lineas (usageTime se trataria como un String), hay que usar updateOne con $inc
    //object.save('done')
    res.end()
}

controller.getAlterAIPage = async (req, res) => {
    let { username } = req.body
    await connection()
    let object = await userModels.findOne({ username : username})
    res.render('alterAI', {
        pfp : object.pfp
    })
}

export default controller
export { makeRoom, deconstructRoom, getNumMessages }