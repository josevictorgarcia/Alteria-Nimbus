import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'
import { getNumMessages } from './userControllers.js'

const controller = {}

controller.getPopularityRanking = async (req, res) => {
    await connection()
    let users = await userModels.find()
    let ranking = []
    for(let i=0; i<users.length; i++){
        let score = users[i].friends.length
        ranking.push( {position : i, pfp : users[i].pfp, username : users[i].username, score : score} )
    }
    ranking.sort((a, b) => b.score - a.score)
    for(let i=0; i<ranking.length; i++){
        ranking[i].position = i+1
    }
    res.render('ranking', {
        option : 'Popularity',
        ranking : ranking
    })
}

controller.getLoyaltyRanking = async (req, res) => {
    await connection()
    let users = await userModels.find()
    let ranking = []
    for(let i=0; i<users.length; i++){
        let score = users[i].usageTime
        ranking.push( {position : i, pfp : users[i].pfp, username : users[i].username, score : score} )
    }
    ranking.sort((a, b) => b.score - a.score)
    for(let i=0; i<ranking.length; i++){
        ranking[i].position = i+1
    }
    res.render('ranking', {
        option : 'Loyalty',
        ranking : ranking
    })
}

controller.getSocialRanking = async (req, res) => {
    await connection()
    let users = await userModels.find()
    let ranking = []
    for(let i=0; i<users.length; i++){
        let { bestFriend, totalMessages } = await getNumMessages(users[i].username)
        let score = totalMessages
        ranking.push( {position : i, pfp : users[i].pfp, username : users[i].username, score : score} )
    }
    ranking.sort((a, b) => b.score - a.score)
    for(let i=0; i<ranking.length; i++){
        ranking[i].position = i+1
    }
    res.render('ranking', {
        option : 'Social',
        ranking : ranking
    })
}

export default controller