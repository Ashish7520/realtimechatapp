const express = require('express')
const router = express.Router()
const userAuthentication = require('../middleware/authanticate')
const massageController = require('../controller/massages')

router.post('/chatbox',userAuthentication, massageController.postMsg)
router.get('/chatbox', userAuthentication, massageController.getMsg)

module.exports = router