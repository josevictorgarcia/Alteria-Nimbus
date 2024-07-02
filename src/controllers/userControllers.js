import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'

const controller = {}

controller.addFriend = async (req, res) => {
    await connection()
    let object = await userModels.findOne({ username : req.query.username })
    let friend = await userModels.findOne({ username : req.query.friend })
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

controller.reloadPage = async (req, res) => {
    await connection()
    let object = await userModels.findOne({ username : req.query.username })
    res.render('user', {
        option : 'Chats',
        username : object.username,
        friends : object.friends
    })
}

export default controller