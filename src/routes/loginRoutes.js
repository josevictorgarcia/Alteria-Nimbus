import express from 'express'
import controller from '../controllers/loginControllers.js'

const router = express.Router()

router.post('/submitloginform', controller.login)

router.get('/signup', controller.getSignUpPage)

export default router