const Massage = require('../model/massage')

exports.postMsg = async(req, res, next) => {
    try {
      const msg = req.body.massage
      console.log('msg-->',msg)
      const massages =await Massage.create({massage:msg,userId:req.user.id})
      res.status(201).json({massages:'massage added successfully',massages,success:true})
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }


  