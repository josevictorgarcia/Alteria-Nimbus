import express from 'express'
import controller from '../controllers/accountControllers.js'
import multer from 'multer'

const upload = multer({ dest: 'public/pfps' }) // Indicar path al directorio

const router = express.Router()

router.post('/uploadProfilePicture', upload.single('avatar'), controller.uploadProfilePicture)

router.post('/changeUsername', controller.changeUsername)

router.post('/changePassword', controller.changePassword)

router.post('/changeRole', controller.changeRole)

router.post('/ban', controller.ban)

export default router