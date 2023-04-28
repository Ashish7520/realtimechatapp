const User = require('../model/user')
const bcrypt = require('bcrypt')

exports.signup = async (req,res,next)=>{
try{
    console.log(req.body)
    
    const username=req.body.username
    const email=req.body.email
    const password = req.body.password
    const saltRound = 10

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