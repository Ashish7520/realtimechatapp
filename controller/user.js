const User = require('../model/user')
const bcrypt = require('bcrypt')

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