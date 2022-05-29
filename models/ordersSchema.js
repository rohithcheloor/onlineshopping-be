const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  orders: [
    {
      productVariantId: {
        type: String,
        required: [true, "Product Variant ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      price: {
        type: Number,
        required: [true, "Variant Price is required"],
      },
      billingAddress: {
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
      invoices: Array,
      offersApplied: Array,
    },
  ],
});
module.exports = mongoose.model("cart", cartSchema);
