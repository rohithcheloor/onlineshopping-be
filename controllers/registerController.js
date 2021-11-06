const registration = require("../models/registrationSchema");
const errorGenerator = require('../utils/errorGenerator')
//Create User
const createUser = async (req, res) => {
  await registration.create(req.body, (err, user) => {
    if (user)
      res.status(200).json({
        success: true,
        _id: user._id,
        message: "User account created Successfully!",
      });
    else
      res.status(404).json({
        success: false,
        message: errorGenerator(err.code, 'user'),
        error: err,
      });
  });
};

//Update User
const updateUser = async (req, res) => {
  await registration.updateOne(
    res.body,
    { userInfo: { id: req.body.userInfo.id } },
    (err, res) => {
      console.log("Error: ", err);
    }
  );
};

//Delete User
const deleteUser = async (req, res) => {
  await registration.deleteOne(
    { userInfo: { id: req.body.userInfo.id } },
    (err, res) => {
      console.log("Error: ", err);
    }
  );
};

//Get All User
const getAllUsers = async (req, res) => {
  await registration.find({}, (err, users) => {
    if (users) return res.status(200).json({ success: true, data: users });
    else if (!users || !users.length) {
      return res.status(404).json({ success: false, error: `No users found` });
    } else {
      return res.status(400).json({ success: false, error: err });
    }
  });
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
