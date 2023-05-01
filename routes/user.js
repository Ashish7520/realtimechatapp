const express = require('express')
const router = express.Router()
const userController = require('../controller/user')
const userAuthentication = require('../middleware/authanticate')

router.post('/signup',userController.signup)

router.post('/login', userController.login)

router.post('/logout',userAuthentication, userController.logout)

router.get('/loggeduser',userAuthentication, userController.loggeduser)

module.exports = router