const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product Name is required"],
  },
  images: Array,
  description: {
    type: String,
  },
  specifications: Array,
  variantCategories: {
    type: Object,
    required: [true, "Variant Category is required"],
  },
  sellerId: {
    type: String,
    required: [true, "Seller ID is required"],
  },
});
module.exports = mongoose.model("products", productSchema);
