import express from 'express'
import controller from '../controllers/rankingControllers.js'

const router = express.Router()

router.get('/popularityRanking', controller.getPopularityRanking)

router.get('/loyaltyRanking', controller.getLoyaltyRanking)

router.get('/socialRanking', controller.getSocialRanking)

export default router