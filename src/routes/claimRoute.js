const express = require('express')
const router = express.Router()
const { checkLogin, checkClient } = require('../middleware/auth')

const claimTaskController = require('../controllers/claimTaskController')

router.post('/start', checkLogin, checkClient, claimTaskController.startTask)
router.post('/claim', checkLogin, checkClient, claimTaskController.claimReward)

module.exports = router
