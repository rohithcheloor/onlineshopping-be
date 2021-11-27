const user = require("../models/userSchema");
const errorGenerator = require("../utils/errorGenerator");
const encryption = require("../utils/encryption");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const checkAccess = (req, callback) => {
  console.log(req.headers.currentUserId);
  if (req.body && req.body._id === req.body.currentUserId) {
    return callback(null, true);
  } else if (req.body) {
    //Check for admin access for current user
  } else {
    return callback(
      {
        success: false,
        _id: req.headers.currentUserId,
        message: "Access denied!",
      },
      null
    );
  }
};
const validateUser = async (userData, callback) => {
  const requestBody = userData.body;
  if (requestBody && requestBody.authInfo && requestBody.authInfo.password) {
    await encryption.encryptPassword(
      requestBody.authInfo.password,
      (err, hash) => {
        if (hash) {
          requestBody.authInfo.password = hash;
        }
        return callback(err, requestBody);
      }
    );
  }
};
const generateToken = (id, username) => {
  const token = jwt.sign({ id, username }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });
  const expiryTime = moment().add(2, "hours").format();
  console.log({ id, username });
  user.updateOne({ _id: id }, { token: token, token_expiry: expiryTime });
  return { token, expiryTime };
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(400).json({
      success: false,
      message: "Missing Credentials.",
    });
  } else {
    const userData = await user.findOne({ "authInfo.username": username });
    if (userData) {
      encryption.comparePassword(
        password,
        userData.authInfo.password,
        (notValidated, validated) => {
          if (validated) {
            const tokenData = generateToken(userData._id, username);
            tokenData &&
              res.status(200).json({
                success: true,
                token: tokenData.token,
                token_expiry: tokenData.expiryTime,
                message: "Token generated.",
              });
          } else {
            res.status(400).json({
              success: false,
              message: "Invalid Credentials.",
            });
          }
        }
      );
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }
  }
};
//Create User
const createUser = async (req, res) => {
  await validateUser(req, async (err, encypted_request) => {
    if (encypted_request) {
      await user.create(encypted_request, (err, user) => {
        if (user)
          res.status(200).json({
            success: true,
            _id: user._id,
            message: "User account created Successfully!",
          });
        else
          res.status(404).json({
            success: false,
            message: errorGenerator(err.code, "user"),
            error: err,
          });
      });
    } else {
      res.status(404).json({
        success: false,
        message: errorGenerator(101, "user"),
        error: err,
      });
    }
  });
};

//Update User
const updateUser = async (req, res) => {
  await validateUser(req, async (err, encypted_request) => {
    if (encypted_request) {
      await user.updateOne(
        { _id: req.body._id },
        encypted_request,
        null,
        (err, patchRes) => {
          if (patchRes) {
            res.status(200).json(patchRes);
          } else {
            res.status(404).json(err);
          }
        }
      );
    } else {
      res.status(404).json({
        success: false,
        message: errorGenerator(101, "user"),
        error: err,
      });
    }
  });
};

//Delete User
const deleteUser = async (req, res) => {
  checkAccess(req);
  await user.deleteOne({ _id: req.body._id }, (err, deleteRes) => {
    if (deleteRes) {
      res.status(200).json({
        success: true,
        _id: user._id,
        message: "User account deleted Successfully!",
      });
    } else {
      res.status(404).json({
        success: true,
        _id: user._id,
        message: err,
      });
    }
  });
};

//Get All User
const getAllUsers = async (req, res) => {
  await user.find({}, (err, users) => {
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
  loginUser,
};
