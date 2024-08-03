import express from 'express'
import controller from '../controllers/accountControllers.js'
import multer from 'multer'

const upload = multer({ dest: 'public/pfps' }) // Indicar path al directorio

const router = express.Router()

router.post('/uploadProfilePicture', upload.single('avatar'), controller.uploadProfilePicture)

export default router