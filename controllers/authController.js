const user = require("../models/userSchema");
const errorGenerator = require("../utils/errorGenerator");
const encryption = require("../utils/encryption");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const generateToken = (id, username) => {
  const token = jwt.sign({ id, username }, process.env.TOKEN_KEY, {
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
            const tokenData = generateToken(userData._id, username); //Generating JWT Token
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
              await user.updateOne(
                {
                  _id: userData._id,
                },
                {
                  "authInfo.tokens": refreshedTokens,
                },
                null,
                (err, updateRes) => {
                  if (updateRes)
                    return res.status(200).json({
                      success: true,
                      token: tokenData.token,
                      token_expiry: tokenData.expiryTime,
                      message: "Token generated.",
                    });
                  else
                    return res.status(500).json({
                      success: false,
                      message: "Token updation failed. Please try again later.",
                    });
                }
              );
            }
          } else {
            return res.status(400).json({
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
  return res.json(req.headers);
};

module.exports = {
  loginUser,
  logoutUser,
};
