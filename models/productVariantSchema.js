const mongoose = require("mongoose");
productSchema = mongoose.Schema({
  seoParams: {
    name: {
      type: String,
      required: [true, "Product Name is required"],
    },
    keywords: Array,
    metaDescription: {
      type: String,
    },
    canonicalUrl: {
      type: String,
    },
    ogUrl: { type: String },
    ogType: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
  },
  productVariantDetails: {
    productId: { type: String, required: [true, "Product Id is required"] },
    name: {
      type: String,
      required: [true, "Variant Name is required"],
    },
    orice: {
      type: Number,
      required: [true, "Variant Price is required"],
    },
    offerPercentage: Number,
    images: Array,
    description: {
      type: String,
    },
    specifications: Array,
  },
});
