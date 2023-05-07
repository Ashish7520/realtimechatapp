const Groups = require('../model/group')
const Groupmsg = require('../model/groupmsg')
const User = require('../model/user')
const Usergroup = require('../model/usergroup')


exports.postGroup = async(req,res,next)=>{
    try {
        const userId = req.user.id
        console.log(userId)
        const groupName = req.body.groupName;
    const group =await Groups.create({groupname:groupName})
    const groupId =  group.id
    const user = await User.findOne({where :{id:userId}})
    const Group = await Groups.findOne({where:{id:groupId}})
    await user.addGroup(Group)

    res.status(201).json({massage: 'group added successfully', group,success:true})
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
    

}

exports.getGroups = async(req,res,next)=>{
    try {
        
        const getGroups = await Groups.findAll()
        res.status(200).json({massage:'groups get successfully', getGroups, success:true})
    } catch (error) {
        console.log(error)
        res.status(404).json({error})
    }
}

exports.postMsg = async(req,res,next)=>{
    try {
        const userId = req.user.id
        const message = req.body.message
        const groupId = req.body.id
        
        const groupMsg =await Groupmsg.create({groupmsg:message, userId:userId,groupId:groupId })
        res.status(201).json({massage:'msg added successfully', groupMsg, success:true})
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}


exports.getMsg = async(req,res,next)=>{
    try {
        const groupId= req.query.clickedGroup;
        console.log(groupId)
        const getMsg = await Groupmsg.findAll({where:{groupId:groupId}})
        res.status(200).json({massage:'get massage successfully', getMsg ,success:true})
    } catch (error) {
        console.log(error);
        res.status(404).json({error})
    }
    
}

