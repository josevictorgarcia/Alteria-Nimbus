import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'
import chatModels from '../database/models/chatModels.js'

const controller = {}

controller.addFriend = async (req, res) => {
    await connection()
    let object = await userModels.findOne({ username : req.query.username })
    let friend = await userModels.findOne({ username : req.query.friend })

    let room = makeRoom(req.query.username, req.query.friend)
    await chatModels.create({ name : room, messages : [] })

    if (friend === null){   //Significa que el amigo no existe
        res.send(false)
    } else {
        if(object.friends.indexOf(req.query.friend) == -1){
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
    res.render('user', {
        option : 'Chats',
        username : object.username,
        friends : object.friends
    })
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
    for (let i=0; i<object.messages.length; i++) {
        let message = object.messages[i]
        setMessageStyle(message, username)
    }
    res.render('message', {
        messages : object.messages,
    })
}

controller.saveMessage = async (req, res) => {
    let room = makeRoom(req.query.username, req.query.friend)
    let message = { message : req.query.message, sender : req.query.username }

    await connection()
    let object = await chatModels.findOne({ name : room })
    object.messages.push(message)
    object.save('done')
    setMessageStyle(message, req.query.username)
    res.render('message', {
        messages : message
    })
}

export default controller