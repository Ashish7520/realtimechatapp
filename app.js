const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const User = require('./model/user')
const Massage = require('./model/massage')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const userRoutes = require('./routes/user')
const msgRoutes = require('./routes/msg')
app.use('/user', userRoutes)


app.use('/massages',msgRoutes)

User.hasMany(Massage)
Massage.belongsTo(User)

sequelize.sync({})
.then((result)=>{
    app.listen(3000)
})
.catch((err)=>{
    console.log(err)
})
