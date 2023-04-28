const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize('realtimechatapp','root','Ashish@2000',{
    dialect : 'mysql',
    host : 'localhost'
})

module.exports = sequelize
