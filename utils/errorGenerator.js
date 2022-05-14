const errorMessages = [
  {
    collection: "user",
    code: 11000,
    message:
      "A user account already exists with the same Username / Email / Phone",
  },
  {
    collection: "user",
    code: 11001,
    message: "Username is already in use. Please try another name",
  },
  {
    collection: "user",
    code: 11002,
    message: "Email / Phone number is already in use. Please try another one",
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
    message: "Invalid Request",
  },
  {
    collection: "user",
    code: 404,
    message: "User not found",
  },
  {
    collection: "user",
    code: 103,
    message: "User account updation failed",
  },
  {
    collection: "product",
    code: 103,
    message: "Product creation failed",
  },
  {
    collection: "user",
    code: 104,
    message: "Invalid Credentials",
  },
  {
    collection: "product",
    code: 105,
    message: "Product updation failed",
  },
  {
    collection: "user",
    code: 401,
    message: "Unauthorized Request",
  },
  {
    collection: "product",
    code: 401,
    message: "Unauthorized Request",
  },
  {
    collection: "product",
    code: 404,
    message: "Product not found",
  },
  {
    collection: "productVariant",
    code: 400,
    message: "Invalid Product Variant found",
  },
  {
    collection: "productVariant",
    code: 404,
    message: "Product Variant not found",
  },

  {
    collection: "productVariant",
    code: 401,
    message: "Unauthorized Request",
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
