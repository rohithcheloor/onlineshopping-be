const mongoose = require("mongoose");
const dbUrl = process.env.DB_ROOT_URL_PRODUCTION;
const username = process.env.DB_CRED_USR;
const password = process.env.DB_CRED_PWD;

mongoose
// .connect(`mongodb://${username}:${password}@${dbUrl}/onlineshopping`, {
  .connect(`mongodb://${dbUrl}/onlineshopping`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;
// db.createUser({
//   user:'admin',
//   pwd:'rohithcmrdz2',
//   roles:[{role: "userAdminAnyDatabase",db: "admin"},{role: "readWriteAnyDatabase",db: "admin"},{role: "dbAdminAnyDatabase",db: "admin"}]
// })
module.exports = db;
