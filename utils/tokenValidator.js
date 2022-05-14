const user = require("../models/userSchema");
const validateToken = async (req) => {
  if (req.headers.authorization) {
    const authToken = req.headers.authorization.split(" ")[1];
    const userData = await user.findOne({
      "authInfo.tokens.token": authToken,
    });
    if (userData) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
module.exports = { validateToken };
