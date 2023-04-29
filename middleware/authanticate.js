const jwt = require('jsonwebtoken')
const User = require('../model/user')
const { use } = require('../routes/user')

const authanticate = (req,res,next)=>{
    try {
        const token = req.header('Authorization')
        console.log('token',token)
        const user = jwt.verify(token,'hdshfugihasuihfdfahjshdfiou6565sdgdsg5565sdgf')
        console.log('user',user)
        User.findByPk(user.userId).then(user=>{
            req.user = user
            next()
        }).catch(err=>{
            console.log(err)
            res.status(201).json(err)
        })
    } catch (error) {
        console.log(error)
        res.status(201).json(error)
        
    }
}

module.exports = authanticate