import express from 'express'
import controller from '../controllers/userControllers.js'

const router = express.Router()

router.get('/addFriend', controller.addFriend)

router.get('/reloadUserPage', controller.reloadPage)

router.get('/loadChatMessages', controller.getChatMessages)

export default router