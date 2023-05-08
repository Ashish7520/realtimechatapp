const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Groups = sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    groupname:Sequelize.STRING,
    adminId:Sequelize.INTEGER
})

module.exports = Groups