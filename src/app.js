import express from 'express'
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import { __dirname } from './dirname.js'
import indexRouter from './routes/indexRoutes.js'
import loginRouter from './routes/loginRoutes.js'
import signupRouter from './routes/signupRoutes.js'
import userRouter from './routes/userRoutes.js'
import { makeRoom } from './controllers/userControllers.js'
import { connectNoInterests, connectInterests, resetAllInterests } from './random.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.set('views', __dirname + '/../views');
app.set('view engine', 'html');
app.engine('html', mustacheExpress(), ".html");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/../public')));

app.use(indexRouter)
app.use(loginRouter)
app.use(signupRouter)
app.use(userRouter)

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
    })

    socket.on('join-room', (room) => {
        if(socket.room != undefined){
            socket.leave(socket.room)
        }
        socket.room = room
        socket.join(room)
    })

    socket.on('join-room-friend', (username, friend) => {
        let room = makeRoom(username, friend)
        if(socket.room != undefined){
            socket.leave(socket.room)
        }
        socket.room = room
        socket.join(room)
    })

    socket.on('send-message', (message, username, friend) => {
        socket.to(socket.room).emit('receive-message', message, username, friend)
    })

    socket.on('connectNoInterests', (id) => {
        let room = connectNoInterests(id)
        //Nos quedamos con la room connectNoInterests y mandamos señal para que el otro socket reactive los botones y sepa que hay alguien mas conectado
        let stopBlocking = false
        let newRoom = ""
        if(room != id){
            stopBlocking = true
            newRoom = makeRoom(id, room)
            io.sockets.in(room).emit('update-room', newRoom)
        }

        if(socket.room != undefined){   //Nos unimos a la room
            socket.leave(socket.room)
        }
        socket.room = newRoom
        socket.join(newRoom)
        if(stopBlocking){
            io.sockets.in(newRoom).emit('update-room', newRoom) //Lo mandamos una segunda vez para que el que se conecta mas tarde reactive los botones
        }
    })

    socket.on('connectInterests', (id, commonInterests) => {
        let room = connectInterests(id, commonInterests)
        let stopBlocking = false
        let newRoom = ""
        if(room != id) {
            stopBlocking = true
            newRoom = makeRoom(id, room)
            io.sockets.in(room).emit('update-room', newRoom)
            io.sockets.in(room).emit('reset-interests')
            io.sockets.in(room).emit('get-common-interests', commonInterests)
        }

        if(socket.room != undefined) {
            socket.leave(socket.room)
        }
        socket.room = newRoom
        socket.join(newRoom)
        if(stopBlocking){
            io.sockets.in(newRoom).emit('update-room', newRoom)
            io.sockets.in(newRoom).emit('reset-interests')
            io.sockets.in(newRoom).emit('get-common-interests', commonInterests)
        }
    })

    socket.on('reset-interests', (interests) => {
        resetAllInterests(interests)
    })

    socket.on('get-common-interests', (userInterests, friendInterests) => {
        let interestsToPrint = []
        let visitados = new Set()
        for (let i=0; i<userInterests.length; i++){
            for (let j=0; j<friendInterests.length; j++){
                if (userInterests[i] == friendInterests[j] && !visitados.has(userInterests[i])){
                    visitados.add(userInterests[i])
                    interestsToPrint.push(userInterests[i])
                }
            }
        }
        io.sockets.in(socket.room).emit('print-interests', interestsToPrint)
    })
})

server.listen(3000, () => {
    console.log('Listening on port 3000!')
})