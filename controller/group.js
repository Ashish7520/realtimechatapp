const {Op} = require("sequelize");
const Groups = require("../model/group");
const Groupmsg = require("../model/groupmsg");
const User = require("../model/user");
const Usergroup = require("../model/usergroup");

exports.postGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const groupName = req.body.groupName;
    const group = await Groups.create({
      groupname: groupName,
      adminId: userId,
    });
    const groupId = group.id;
    await Usergroup.create({ isAdmin: true, userId: userId, groupId: groupId });
    // const user = await User.findOne({where :{id:userId}})
    // const Group = await Groups.findOne({where:{id:groupId}})
    // await user.addGroup(Group)

    res
      .status(201)
      .json({ massage: "group added successfully", group, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const userId = req.user.id
    const getGroups = await Groups.findAll({
        include: [{
          model: User,
          where: { id: userId }
        }]
      });
    res
      .status(200)
      .json({ massage: "groups get successfully", getGroups, success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

exports.postMsg = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const message = req.body.message;
    const groupId = req.body.id;

    const groupMsg = await Groupmsg.create({
      groupmsg: message,
      userId: userId,
      groupId: groupId,
    });
    
    const user = await User.findOne({where:{id:userId}})
    res
      .status(201)
      .json({ massage: "msg added successfully", groupMsg,user, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getMsg = async (req, res, next) => {
  try {
    const groupId = req.query.clickedGroup;
    console.log(groupId);
    const getMsg = await Groupmsg.findAll({
      where: { groupId: groupId },
      include: [{
        model: User,
        attributes: ['username']
      }]
    });
    res
      .status(200)
      .json({ massage: "get massage successfully", getMsg, success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

exports.addUser = async (req, res) => {
  try {
    const email = req.body.email;
    //console.log(email)
    const groupId = req.body.groupId;
    //console.log(groupId)

    const user = await User.findOne({where:{email:email}})
    if(!user){
        return res.status(404).json({massage:'user not found', success:false})
    }
   const groupUser = await Usergroup.create({
    userId:user.id,
    groupId:groupId
   })
  
    res.status(201).json({massage:'user added successfully', groupUser,user, success:true})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error , success:false});
  }
};

exports.getUsers = async(req,res)=>{
  try {
    const userId = req.user.id;
    const groupId = req.query.clickedGroup;
    console.log('userId:', userId);
    console.log('groupId:', groupId);
    const users = await User.findAll({
      where: {
        id: { [Op.not]: userId } // Exclude the user with the specified id
      },
      include: [
        {
          model: Groups,
          where: { id: groupId }
        }
      ]
    });
    console.log('number of users:', users.length);
res.status(200).json({users:users, success:true, massage:'users found successfully'})
  } catch (error) {
    console.log(error)
    res.status(500).json({error})
  }
}

exports.removeUser = async(req,res)=>{
  try {
    const userId = req.body.userId
    const groupId = req.body.groupId
    const isUserAdmin = await Usergroup.findOne({where:{userId:req.user.id}})
    if(!isUserAdmin.isAdmin){
      return res.status(400).json({massage:'you are not admin', success:false})
    }
   const isGroupMember = await Usergroup.findOne({where:{userId:userId, groupId:groupId}})
   if(!isGroupMember){
    return res.status(404).json({massage:'user not found', success:false})
   }else{
    await Usergroup.destroy({where:{userId:userId}})
    console.log('user destroy sucessfully')
    res.status(200).json({massage:'user removed successfully'})
   }
  } catch (error) {
    console.log(error)
    res.status(500).json({error})
  }
}

exports.makeAdmin = async(req,res)=>{
  try {
    const userId = req.body.userId
    const groupId = req.body.groupId
    const isUserAdmin = await Usergroup.findOne({where:{userId:req.user.id}})
    if(!isUserAdmin.isAdmin){
      return res.status(400).json({massage:'you are not admin', success:false})
    }
    const isAdmin = await Usergroup.findOne({where:{userId:userId,groupId:groupId}})
     if(isAdmin.isAdmin){
       res.status(400).json({massage:'user already an admin', success:false})
     }else{
      isAdmin.isAdmin = true
      await isAdmin.save()
      res.status(201).json({massage:'user is now an admin', success:true})
     }
  } catch (err) {
    console.error(err)
    res.status(500).json({massage:'server error', success:false})
  }
}
