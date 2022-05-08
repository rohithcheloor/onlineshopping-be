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
// To Encrypt password
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
          return res.status(200).json({
            success: true,
            _id: user._id,
            message: "User account created Successfully!",
          });
        else
          return res.status(404).json({
            success: false,
            message: errorGenerator(err.code, "user"),
            error: err,
          });
      });
    } else {
      return res.status(404).json({
        success: false,
        message: errorGenerator(101, "user"),
        error: err,
      });
    }
  });
};

//Update User
const updateUserDetails = async (req, res) => {
  if (req.headers.authorization) {
    const authToken = req.headers.authorization.split(" ")[1];
    const updateData = req.body;
    const userData = await user.findOne({
      "authInfo.tokens.token": authToken,
    });
    if (userData) {
      const existingData = await user
        .find({ _id: { $ne: userData._id } })
        .or([
          { "userInfo.email": updateData.userInfo.email },
          { "userInfo.phone": updateData.userInfo.phone },
        ]);
      if (existingData.length > 0) {
        return res.status(409).json({
          success: false,
          message: errorGenerator(11002, "user"),
        });
      } else {
        delete updateData.authInfo; //remove auth info from update data to prevent authentication info from being manipulated
        await user
          .findOneAndUpdate(
            {
              "authInfo.tokens.token": authToken,
            },
            updateData
          )
          .then(
            () => {
              return res.status(200).json({
                success: true,
                message: "User details Updated successfully",
              });
            },
            (onErr) => {
              return res.status(500).json({
                success: false,
                message: "Updation failed",
                err: onErr,
              });
            }
          );
      }
    }
  } else {
    return res.status(401).json({
      success: false,
      message: errorGenerator(401, "user"),
    });
  }
};

//Update Credentials
const updateUserCredentials = async (req, res) => {
  const authToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  const updateData = req.body;
  if (authToken && req.headers.password && updateData && updateData.authInfo) {
    const userData = await user.findOne({
      "authInfo.tokens.token": authToken,
    });
    if (userData) {
      encryption.comparePassword(
        req.headers.password,
        userData.authInfo.password,
        async (err, success) => {
          if (success) {
            updateData.authInfo.tokens = userData.authInfo.tokens;
            if (updateData.authInfo.password === userData.authInfo.password) {
              // If password in body is encrypted
              const checkUsernameAvailability = await user.find({
                "authInfo.username": updateData.authInfo.username,
                _id: { $ne: userData._id },
              });
              if (checkUsernameAvailability.length > 0) {
                return res.status(409).json({
                  success: true,
                  message: errorGenerator(11001, "user"),
                });
              } else {
                userData.authInfo = updateData.authInfo;
                userData.save().then(
                  () => {
                    return res.status(200).json({
                      success: true,
                      message: "User details Updated successfully",
                    });
                  },
                  (saveError) => {
                    return res.status(500).json({
                      success: true,
                      message: "Failed to update user details",
                      err: saveError,
                    });
                  }
                );
              }
            } else {
              // If password in body is plain text
              encryptUserData(req, async (encErr, encypted_request) => {
                if (encypted_request) {
                  const checkUsernameAvailability = await user.find({
                    "authInfo.username": updateData.authInfo.username,
                    _id: { $ne: userData._id },
                  });
                  if (checkUsernameAvailability.length > 0) {
                    return res.status(409).json({
                      success: true,
                      message: errorGenerator(11001, "user"),
                    });
                  } else {
                    userData.authInfo = encypted_request.authInfo;
                    userData
                      .save()
                      .then(
                        () => {
                          return res.status(200).json({
                            success: true,
                            message: "User details Updated successfully",
                          });
                        },
                        (saveError) => {
                          return res.status(500).json({
                            success: true,
                            message: "Failed to update user details",
                            err: saveError,
                          });
                        }
                      )
                      .catch((err) => {
                        return res.status(500).json({
                          success: true,
                          message: "Failed to update user details",
                          err: err,
                        });
                      });
                  }
                } else if (encErr) {
                  return res.status(500).json({
                    success: true,
                    message: "Failed to update user details",
                    err: saveError,
                  });
                }
              });
            }
          } else {
            return res.status(401).json({
              success: false,
              message: errorGenerator(401, "user"),
            });
          }
        }
      );
    } else {
      return res.status(401).json({
        success: false,
        message: errorGenerator(401, "user"),
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: errorGenerator(401, "user"),
    });
  }
};

//Delete User
const deleteUser = async (req, res) => {
  await checkAccess(req, async (err, checkRes) => {
    if (checkRes) {
      await user.deleteOne({ _id: req.body._id }, (deleteErr, deleteRes) => {
        if (deleteRes && deleteRes.deletedCount > 0) {
          return res.status(200).json({
            success: true,
            _id: user._id,
            message: "User account deleted Successfully!",
          });
        } else {
          return res.status(404).json({
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

//Get All Users
const getAllUsers = async (req, res) => {
  const users = await user.find({});
  if (users) return res.status(200).json({ success: true, data: users });
  else if (!users || !users.length) {
    return res.status(404).json({ success: false, error: `No users found` });
  } else {
    return res.status(400).json({ success: false, error: err });
  }
};

module.exports = {
  createUser,
  updateUserCredentials,
  updateUserDetails,
  deleteUser,
  getAllUsers,
};
