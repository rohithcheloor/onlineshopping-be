const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    authInfo: {
      username: { type: String, unique: true, required: [true, "Username is required"] },
      password: { type: String, required: [true, "Password is required"] },
      privilege: { type: String, required: [true, "User Privilege is required"] }
    },
    userInfo: {
      firstname: { type: String, required: [true, "Firstname is required"] },
      middlename: { type: String, required: false },
      lastname: { type: String, required: [true, "Lastname is required"] },
      image: Array,
      billingAddress: [
        {
          building: {
            type: String,
            required: [true, "Building/House number is required"],
          },
          street: {
            type: String,
            required: [true, "Street/Locality is required"],
          },
          city: { type: String, required: [true, "City is required"] },
          country: {
            type: String,
            required: [true, "Country is required"],
          },
          postalcode: {
            type: String,
            required: [true, "Postal Code is required"],
          },
        },
      ],
      deliveryAddress: [
        {
          building: {
            type: String,
            required: [true, "Building/House number is required"],
          },
          street: {
            type: String,
            required: [true, "Street/Locality is required"],
          },
          city: { type: String, required: [true, "City is required"] },
          country: {
            type: String,
            required: [true, "Country is required"],
          },
          postalcode: {
            type: String,
            required: [true, "Postal Code is required"],
          },
        },
      ],
      email: { type: String, unique: true, required: [true, "Email ID is required"] },
      emailVerified: { type: Boolean, required: true },
      phone: { type: String, unique: true, required: [true, "Phone number is required"] },
      phoneVerified: { type: Boolean, required: true },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("users", userSchema);
