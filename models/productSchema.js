const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  productDetails: {
    name: {
      type: String,
      required: [true, "Product Name is required"],
    },
    images: Array,
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    specifications: Array,
    variantCategories: Array,
  },
});
module.exports = mongoose.model("product", productSchema);
