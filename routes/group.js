const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/authanticate')

const groupController = require('../controller/group')

router.post('/group',userAuthentication, groupController.postGroup)
router.get('/group', groupController.getGroups)
router.post('/groupmsg' ,userAuthentication, groupController.postMsg)
router.get('/groupmsg', groupController.getMsg)

module.exports = router