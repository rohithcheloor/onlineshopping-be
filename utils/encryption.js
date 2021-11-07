const bcrypt = require('bcrypt');

const encryptPassword = (password, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) 
          return callback(err);
        bcrypt.hash(password, salt, (err, hash) => {
          return callback(err, hash);
        });
      });
}

const comparePassword = (password, hashword) => {
    return bcrypt.compare(password, hashword,(err, res) => {
        if(err) return err
        else return res
    })
}
module.exports = { encryptPassword, comparePassword }