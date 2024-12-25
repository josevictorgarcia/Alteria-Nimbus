import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'
import { getNumMessages } from './userControllers.js'
import { addOnlineUser } from '../onlineUsers.js'
import { publicIpv4 } from 'public-ip';

const controller = {}

controller.index = (req, res) => {
    res.render('index', {

    })
}

controller.getIP = async (req, res) => {
    //https://github.com/sindresorhus/public-ip
    //https://github.com/alsotang/externalip?tab=readme-ov-file

    /*console.log(await publicIp()); // Falls back to IPv4
    //=> 'fe80::200:f8ff:fe21:67cf'

    console.log(await publicIpv6());
    //=> 'fe80::200:f8ff:fe21:67cf'

    console.log(await publicIpv4());
    //=> '46.5.21.123'*/
    res.send(await publicIpv4())
}

controller.addIP = async (req, res) => {
    addOnlineUser(req.query.username, await publicIpv4())
    console.log('Public Ipv4:', await publicIpv4());
    res.end()
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