const mongoose = require("mongoose");
const dbUrl = process.env.DB_ROOT_URL_PRODUCTION;
const username = process.env.DB_CRED_USR;
const password = process.env.DB_CRED_PWD;

mongoose
  .connect(`mongodb://${username}:${password}@${dbUrl}/onlineshopping`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
