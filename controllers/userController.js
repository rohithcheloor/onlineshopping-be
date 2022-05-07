const user = require("../models/userSchema");
const errorGenerator = require("../utils/errorGenerator");
const encryption = require("../utils/encryption");
const flattenObject = require("../utils/flatten");
const checkAccess = async (req, callback) => {
  if (req.body && req.body._id === req.body.currentUserId) {
    return callback(null, true);
  } else if (req.body) {
    //Check for admin access for current user
    const currentUserData = await user.findOne({
      "authInfo.username": req.body.authInfo.username,
    });
    if (
      currentUserData.authInfo &&
      currentUserData.authInfo.privilege &&
      currentUserData.authInfo.privilege === "admin"
    ) {
      return callback(null, true);
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
const encryptUserData = async (userData, callback) => {
  const requestBody = userData.body;
  if (requestBody && requestBody.authInfo && requestBody.authInfo.password) {
    const userData = await user.findOne({
      "authInfo.username": requestBody.authInfo.username,
    });
    if (userData) {
      requestBody.authInfo.tokens = userData.authInfo.tokens;
    }
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

//Create User
const createUser = async (req, res) => {
  await encryptUserData(req, async (err, encypted_request) => {
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
const updateUserDetails = async (req, res) => {
  const userDetails = await user.findById(req.body._id);
  if (userDetails) {
    encryption.comparePassword(
      req.body.authInfo.password,
      userDetails.authInfo.password,
      async (invalid, valid) => {
        if (valid) {
          const authInfo = userDetails.authInfo;
          req.body.authInfo = authInfo;
          user.updateOne(
            { _id: req.body._id },
            req.body,
            null,
            (err, patchRes) => {
              if (patchRes && patchRes.modifiedCount > 0) {
                res.status(200).json({
                  success: true,
                  _id: user._id,
                  message: "Updated User!",
                  ...patchRes,
                });
              } else {
                res.status(404).json({
                  success: false,
                  message: "User account does not exist!",
                  err: err,
                });
              }
            }
          );
        } else {
          res.status(404).json({
            success: false,
            message: errorGenerator(104, "user"),
          });
        }
      }
    );
  } else {
    res.status(404).json({
      success: false,
      message: errorGenerator(102, "user"),
    });
  }
};

//Update Credentials
const updateUserCredentials = async (req, res) => {
  const userDetails = await user.findById(req.body._id);
  if (userDetails) {
    const authInfo = userDetails.authInfo;
    req.body.authInfo = authInfo;
    user.updateOne({ _id: req.body._id }, req.body, null, (err, patchRes) => {
      if (patchRes && patchRes.modifiedCount > 0) {
        res.status(200).json({
          success: true,
          _id: user._id,
          message: "Updated User!",
          ...patchRes,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User account does not exist!",
          err: err,
        });
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: errorGenerator(102, "user"),
    });
  }
};

//Delete User
const deleteUser = async (req, res) => {
  await checkAccess(req, async (err, checkRes) => {
    if (checkRes) {
      await user.deleteOne({ _id: req.body._id }, (deleteErr, deleteRes) => {
        if (deleteRes && deleteRes.deletedCount > 0) {
          res.status(200).json({
            success: true,
            _id: user._id,
            message: "User account deleted Successfully!",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "User account does not exist!",
          });
        }
      });
    } else {
      return res.status(403).json(err);
    }
  });
};

//Get All User
const getAllUsers = async (req, res) => {
  const users = await user.find({});
  if (users) res.status(200).json({ success: true, data: users });
  else if (!users || !users.length) {
    res.status(404).json({ success: false, error: `No users found` });
  } else {
    res.status(400).json({ success: false, error: err });
  }
};

module.exports = {
  createUser,
  updateUserDetails,
  deleteUser,
  getAllUsers,
};
