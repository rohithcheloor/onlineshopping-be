const bcrypt = require("bcrypt");

const encryptPassword = (password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);
    bcrypt.hash(password, salt, (err, hash) => {
      return callback(err, hash);
    });
  });
};

const comparePassword = (password, hashword, callback) => {
  return bcrypt.compare(password, hashword, (err, res) => {
    return callback(err, res);
  });
};
module.exports = { encryptPassword, comparePassword };
