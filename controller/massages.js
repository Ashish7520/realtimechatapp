const Massage = require("../model/massage");
const User = require("../model/user");
const Sequelize =require('sequelize')

exports.postMsg = async (req, res, next) => {
  try {
    const msg = req.body.massage;
    const username = req.user.username
    const massages = await Massage.create({
      massage: msg,
      userId: req.user.id,
    });
    res
      .status(201)
      .json({
        massages: "massage added successfully",
        massages,
        username,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.getMsg = async (req, res, next) => {
  try {
    const allMsg = await Massage.findAll({
      attributes: ['massage'],
      include: [{
        model: User,
        attributes: ['username'],
      }],
      raw: true,
    });
    res.status(201).json({ msg: allMsg, success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};
