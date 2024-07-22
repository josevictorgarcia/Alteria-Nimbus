import express from 'express'
import controller from '../controllers/accountControllers.js'

const router = express.Router()

router.post('/uploadProfilePicture', controller.uploadProfilePicture)

export default router