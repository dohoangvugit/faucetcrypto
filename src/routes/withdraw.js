const express = require('express')
const router = express.Router()
const { checkLogin, checkClient } = require('../middleware/auth')

const withdrawController = require('../controllers/withdrawController') 

router.get('/withdraw', checkLogin, checkClient, withdrawController.getWithdraw)
router.post('/withdraw', checkLogin, checkClient, withdrawController.postWithdraw)

module.exports = router