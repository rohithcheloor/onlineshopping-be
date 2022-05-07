const user = require("../models/userSchema");
const encryption = require("../utils/encryption");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const flattenObject = require("../utils/flatten");

const generateToken = (id, username, password) => {
  const token = jwt.sign({ id, username }, password, {
    expiresIn: "2h",
  });
  const expiryTime = moment().add(2, "hours").format();
  return { token, expiryTime };
};

//Login User
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
        async (notValidated, validated) => {
          if (validated) {
            const tokenData = generateToken(userData._id, username, password); //Generating JWT Token
            if (tokenData && userData.authInfo.tokens) {
              const refreshedTokens = [];
              userData.authInfo.tokens.forEach((token, index) => {
                //Removing expired tokens & previous token for same IP
                if (
                  !token.expiry < moment().format() ||
                  !token.expiry === null ||
                  !token.ip == req.socket.remoteAddress
                ) {
                  refreshedTokens.push(token);
                }
              });
              refreshedTokens.push({
                token: tokenData.token,
                expiry: tokenData.expiryTime,
                ip: req.socket.remoteAddress,
              });
              userData.authInfo.tokens = refreshedTokens;
              await userData.save().then((updateRes, err) => {
                if (updateRes)
                  res.status(200).json({
                    success: true,
                    token: tokenData.token,
                    token_expiry: tokenData.expiryTime,
                    message: "Token generated.",
                  });
                else
                  res.status(500).json({
                    success: false,
                    message: "Token updation failed. Please try again later.",
                    err: err,
                  });
              });
            } else {
              res.status(400).json({
                success: false,
                message: "Invalid Credentials.",
              });
            }
          } else {
            res.status(400).json({
              success: false,
              message: "Invalid Credentials.",
            });
          }
        }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }
  }
};

const logoutUser = async (req, res) => {
  const { authorization } = req.headers;
  authToken = authorization.replace("Bearer ", "");
  const userData = await user.findOne({
    "authInfo.tokens": { $elemMatch: { token: authToken } },
  });
  if (userData) {
    const refreshedTokens = [];
    userData.authInfo.tokens.forEach((token, index) => {
      //Removing expired tokens & previous token for same IP
      if (
        !token.expiry < moment().format() ||
        !token.expiry === null ||
        !token.token == authToken
      ) {
        refreshedTokens.push(token);
      }
    });
    userData.authInfo.tokens = refreshedTokens;
    await userData.save().then((updateRes, err) => {
      if (updateRes)
        return res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      else
        return res.status(500).json({
          success: false,
          message: "Token discarding failed. Please try again later.",
        });
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Logout failed. Please try again later.",
    });
  }
};

module.exports = {
  loginUser,
  logoutUser,
};
