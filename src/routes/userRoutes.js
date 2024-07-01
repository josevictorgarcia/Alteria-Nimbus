import express from 'express'
import controller from '../controllers/userControllers.js'

const router = express.Router()

router.get('/addFriend', controller.addFriend)

export default router