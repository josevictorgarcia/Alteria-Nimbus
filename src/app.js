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

    socket.on('send-message', (message, username, friend) => {
        io.emit('receive-message', message, username, friend)
    })
})

server.listen(3000, () => {
    console.log('Listening on port 3000!')
})