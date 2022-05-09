const mongoose = require("mongoose");
productSchema = mongoose.Schema({
  productDetails: {
    name: {
      type: String,
      required: [true, "Product Name is required"],
    },
    defaultPrice: {
      type: Number,
      required: [true, "Product Price is required"],
    },
    defaultOfferPercentage: Number,
    images: Array,
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    specifications: Array,
  },
});
