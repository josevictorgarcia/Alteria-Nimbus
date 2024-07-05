import express from 'express'
import { io } from 'socket.io-client';      //Solo usar sockets en las paginas que lo necesiten. Por ejemplo, en el index (aqui) se podria quitar
import controller from '../controllers/indexControllers.js'

const socket = io("https://localhost:3000");

const router = express.Router()

router.get('/', controller.index)

router.get('/login', controller.getLoginPage)

router.get('/rooms', controller.getRoomsPage)

export default router