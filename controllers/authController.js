const registration = require("../models/userSchema");

//Create User
const loginUser = (req, res) => {
  const { username, password } = req.body;
  registration.findOne({ authInfo: { username, password } }, (err, user) => {
    console.log("Error: ", err);
    console.log("Response: ", user);
  });
};
module.exports = {
  loginUser,
};
