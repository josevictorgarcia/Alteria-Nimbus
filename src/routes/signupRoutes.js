import express from 'express'
import controller from '../controllers/signupControllers.js'

const router = express.Router()

router.post('/submitsignupform', controller.signup)

export default router