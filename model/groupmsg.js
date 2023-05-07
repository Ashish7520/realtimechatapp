const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Groupmsg = sequelize.define('groupmsg',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    groupmsg:Sequelize.STRING
})

module.exports = Groupmsg