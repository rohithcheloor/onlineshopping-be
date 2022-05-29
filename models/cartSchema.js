const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  cartItems: [
    {
      productVariantId: {
        type: String,
        required: [true, "Product Variant ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
    },
  ],
});
module.exports = mongoose.model("cart", cartSchema);
