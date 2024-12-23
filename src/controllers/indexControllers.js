import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'
import { getNumMessages } from './userControllers.js'

const controller = {}

controller.index = (req, res) => {
    res.render('index', {

    })
}

controller.getLoginPage = (req, res) => {
    let message = req.query.message
    res.render('login', {
        message : message
    })
}

controller.getRoomsPage = (req, res) => {
    res.render('rooms', {
        
    })
}

controller.getRandomPage = (req, res) => {
    res.render('random', {
        
    })
}

controller.getRankingPage = async (req, res) => {
    await connection()
    let users = await userModels.find()
    let ranking = []
    for(let i=0; i<users.length; i++){
        let { bestFriend, totalMessages } = await getNumMessages(users[i].username)
        let score = 0.3*users[i].usageTime + 0.3*users[i].friends.length + 0.3*totalMessages
        ranking.push( {position : i, pfp : users[i].pfp, name : users[i].name, score : score} )
    }
    ranking.sort((a, b) => b.score - a.score)
    for(let i=0; i<ranking.length; i++){
        ranking[i].position = i+1
    }
    res.render('ranking', {
        option : 'Overall',
        ranking : ranking
    })
}

export default controller