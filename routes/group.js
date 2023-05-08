const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/authanticate')

const groupController = require('../controller/group')

router.post('/group',userAuthentication, groupController.postGroup)
router.get('/group',userAuthentication, groupController.getGroups)
router.post('/groupmsg' ,userAuthentication, groupController.postMsg)
router.get('/groupmsg', groupController.getMsg)
router.post('/adduser',groupController.addUser)
router.get('/users',userAuthentication, groupController.getUsers)
router.delete('/removeuser', userAuthentication, groupController.removeUser)
router.put('/makeadmin', userAuthentication,groupController.makeAdmin)

module.exports = router