const mongoose = require("mongoose");
const dbUrl = process.env.DB_ROOT_URL_PRODUCTION;
const username = process.env.DB_CRED_USR;
const password = process.env.DB_CRED_PWD;

// .connect(`mongodb://${dbUrl}/onlineshopping`, {
  let connectionString = ``;
  if(username && password){
    connectionString = `mongodb://${username}:${password}@${dbUrl}/onlineshopping`
  }else{
    connectionString=`mongodb://${dbUrl}/onlineshopping`
  }
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    console.log("Connected to DB")
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;
module.exports = db;
