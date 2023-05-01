const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const User = require('./model/user')
const Msg = require('./model/massage')


const app = express()
app.use(bodyParser.json())
app.use(cors())

const userRoutes = require('./routes/user')
const msgRoutes = require('./routes/msg')
app.use('/user', userRoutes)


app.use('/massages',msgRoutes)

User.hasMany(Msg)
Msg.belongsTo(User)

sequelize.sync({})
.then((result)=>{
    console.log('user running on port 3000')
    app.listen(3000)
})
.catch((err)=>{
    console.log(err)
})
