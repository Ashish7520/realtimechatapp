const User = require('../model/user')
const session = require('../middleware/sessions')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { use } = require('../routes/user')

function generatejsontoken(id,username,isLoggedIn){
  return jwt.sign({userId:id, username:username,isLoggedIn},'hdshfugihasuihfdfahjshdfiou6565sdgdsg5565sdgf')
}

exports.signup = async (req,res,next)=>{
try{
    console.log(req.body)
    
    const username=req.body.username
    const email=req.body.email
    const password = req.body.password
    const saltRound = 10

    if(username == undefined || username.length === 0 || email == undefined || email.length === 0 || password == undefined || password.length === 0 ){
        return res.status(400).json({err:'bad parameters. something is missing'})
      }

    const hashedPassword =await bcrypt.hash(password,saltRound)
   
  await  User.create({
       username:username,
       email:email,
       password:hashedPassword
    })

   await res.status(201).json({massage:'user created successfully', success:true})
}
catch(err){
    console.log(err)
    res.status(500).json(err)
}


}

exports.login = async (req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        const user =await User.findOne({where:{email}})
        if(!user){
            return res.status(404).json({massage:'User does not exist', success:false})
        }

        const isPasswordValid =await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(401).json({massage:'password is incorrect', success: false})
        }
       // console.log('user', user.id)
        await User.update({isLoggedIn: 0}, {where: {id: user.id}});
        res.status(200).json({massage:'user logged in successfully', success: true,token:generatejsontoken(user.id, user.username,user.isLoggedIn)})
        
    
        
    } catch (error) {
        console.log(error)
        res.status(500).json({massage:error, success:false})
    }
}

exports.logout = async(req,res)=>{
    try {
        const username= req.user.username
        await User.update({isLoggedIn:1}, {where: {id: req.user.id}});
        res.status(201).json({massage:'user  logged out successfully',username,success:true, token:generatejsontoken(req.user.id, req.user.username,req.user.isLoggedIn)})
    } catch (error) {
        console.log(error)
        res.status(400).json({massage:error, success:false})
        
    }
}

exports.loggeduser=async(req,res)=>{
    try {
        const users = await User.findAll({where: { isLoggedIn : 0}})
        //console.log(users)
        res.status(200).json({users:users, success:true})
    } catch (error) {
        console.log(error)
        res.status(404).json({error, success:false})
    }
   
}