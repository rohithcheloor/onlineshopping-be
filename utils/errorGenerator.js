const errorMessages = [
  {
    collection: "user",
    code: 11000,
    message:
      "A user account already exists with the same Username / Email / Phone",
  },
  {
    collection: "user",
    code: 100,
    message: "Password not provided",
  },
  {
    collection: "user",
    code: 101,
    message: "Invalid Password",
  },
  {
    collection: "user",
    code: 102,
    message: "User not found",
  },
  {
    collection: "user",
    code: 103,
    message: "User account updation failed",
  },
  {
    collection: "user",
    code: 104,
    message: "Invalid Credentials",
  },
];
const errorGenerator = (errorCode, collection) => {
  const returnMessage = errorMessages.find(
    (item) => item.collection === collection && item.code === errorCode
  ).message;
  if (returnMessage) {
    return returnMessage;
  } else {
    return "An error occured!";
  }
};

module.exports = errorGenerator;
