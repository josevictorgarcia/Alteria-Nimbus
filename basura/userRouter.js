//import * as users from './users.js'
//import * as roomGen from './roomGen.js'
//import * as interestMap from './interestMap.js'
//import * as loggedUsersGraph from './LoggedUsersGraph.js'
import express from 'express'
import { io } from 'socket.io-client';
const socket = io("https://localhost:3000");


/*socket.on("connection", (socket) => {
    console.log(socket.id)
    //res.end()
});*/

/*socket.on("message", (message) => {
    console.log(message)
    //res.end()
})*/

const router = express.Router()

router.get('/', (req, res) => {
//    let id = users.getID();
    res.render('index', {
//        id: id
    })
})

router.get('/addMessage', (req, res) => {
    let message = req.query.message
    let id = parseInt(req.query.user)
    let user = "User" + req.query.user
    if(req.query.socketID === users.getUser(id)){
        user = "You"
    }
    res.render('message', {
        message: message,
        user: user
    })
})

router.get('/addUser', (req, res) => {
    let user = req.query.user
    users.addUser(user)
    console.log(users.getUsers())
    res.end()
})

router.get('/waitconnection', (req, res) => {
    let interests = req.query.interests
    //if(interests === ""){
    //    res.send(interestMap.waiting(0))
        //res.send(roomGen.waiting())
    //} else{
        res.send(interestMap.waiting(interests))
    //}
})

router.get('/setInterests', (req, res) => {
    let interests = req.query.interests
    //console.log(interestMap.waiting(interests))
    res.send(interestMap.setInterest(interests))
})

router.get('/deleteInterests', (req, res) => {
    let interests = req.query.interests
    interestMap.deleteInterest(interests)
    res.end()
})

router.get('/get2RandomPage', (req, res) => {
    res.render('2random', {
        id: req.query.id
    })
})

router.get('/getRoomPage', (req, res) => {
    res.render('room', {
        id: req.query.id
    })
})

/*router.get('/getCommonInterests', (req, res) => {
    let interests = req.query.interests
    res.send(interestMap.getCommonInterests(interests))
})*/
/*
router.get('/addUser', (req, res) => {
    let name = req.query.nombre;

    let nameExists = elementos.existe(name);            //Comprueba si un nombre es valido
    console.log(nameExists);

    if(!nameExists){
        let age = req.query.edad;
        console.log(name);
        console.log(age);
        let newUser = {nombre: name, edad: age};
        elementos.addElem(newUser);

        let elems = elementos.getElems();
        res.render('listOfUsers', {
            users: elems
        })
    }
    else{
        res.render('message', {
            name: name
        })
    }
})*/

router.get('/getLoginPage', (req, res) => {
    let opcion = req.query.option
    let optionText = "Login"
    let option = "login()"
    if (opcion == "signUp"){
        optionText = "Sign Up"
        option = "signUp()"
    }
    res.render('login.html', {
        option: option,
        optionText: optionText
    })
})

router.get('/register', (req, res) => {
    res.send(loggedUsersGraph.addUser(req.query.usuario, req.query.contrasena))
})

router.get('/login', (req, res) => {
    res.send(loggedUsersGraph.access(req.query.usuario, req.query.contrasena))
})

router.get('/getUsuario', (req, res) => {
    let usuario = req.query.usuario
    //loggedUsersGraph.addAdjacentUser(usuario, "antonio")
    //loggedUsersGraph.addAdjacentUser(usuario, "maria")
    //loggedUsersGraph.addAdjacentUser(usuario, "cabron")
    res.render('profile.html', {
        username: usuario,
        contactos: loggedUsersGraph.getUser(usuario)
    })
})

router.get('/addContact', (req, res) => {
    let usuario = req.query.usuario
    let contact = req.query.contact
    let added = loggedUsersGraph.addAdjacentUser(usuario, contact)
    let message = "User couldn't be added"
    if (added === "true"){
        message = "User added to your contacts"
    }
    res.render('profile.html', {
        username: usuario,
        contactos: loggedUsersGraph.getUser(usuario),
        message: message
    })
})

router.get('/getChatPage', (req, res) => {
    res.render('chat.html', {
        contact: req.query.contact
    })
})

router.get('/getAlterAInimbusPage', (req, res) => {
    res.render('alterAI.html', {

    })
})

export default router