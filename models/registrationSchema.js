const mongoose = require("mongoose");
const registrationSchema = mongoose.Schema(
  {
    authInfo: {
      username: { type: String, required: [true, "Username is required"] },
      password: { type: String, required: [true, "Password is required"] },
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
      email: { type: String, required: [true, "Email ID is required"] },
      emailVerified: { type: Boolean, required: true },
      phone: { type: String, required: [true, "Phone number is required"] },
      phoneVerified: { type: Boolean, required: true },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("registration", registrationSchema);
