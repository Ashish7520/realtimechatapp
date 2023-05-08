const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const User = require('./model/user')
const Msg = require('./model/massage')
const userGroup = require('./model/usergroup')
const Group = require('./model/group')
const Groupmsg = require('./model/groupmsg')
const Forgotpassword = require('./model/forgotpassword')


const app = express()
app.use(bodyParser.json())
app.use(cors())

const userRoutes = require('./routes/user')
const msgRoutes = require('./routes/msg')
app.use('/user', userRoutes)


app.use('/massages',msgRoutes)

const groupRoutes = require('./routes/group')
app.use('/groups',groupRoutes)

const resetPasswordRoutes = require('./routes/forgotpassword')
app.use('/password', resetPasswordRoutes);


User.hasMany(Msg)
Msg.belongsTo(User)

User.hasMany(Groupmsg)
Groupmsg.belongsTo(User)

Group.hasMany(Groupmsg)
Groupmsg.belongsTo(Group)

User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });
userGroup.belongsTo(User)
userGroup.belongsTo(Group)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync()
.then((result)=>{
    console.log('user running on port 3000')
    app.listen(3000)
})
.catch((err)=>{
    console.log(err)
})
