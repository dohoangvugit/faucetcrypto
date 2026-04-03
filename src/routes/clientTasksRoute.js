const express = require('express')
const router = express.Router()
const taskControllerClient = require('../controllers/tasksClientController')
const { checkLogin, checkClient } = require('../middleware/auth')

router.get('/tasks', checkLogin, checkClient, taskControllerClient.listClientTasks)

module.exports = router 