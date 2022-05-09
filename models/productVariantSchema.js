const mongoose = require("mongoose");
const productVariantSchema = mongoose.Schema({
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
    variantName: {
      type: String,
      required: [true, "Variant Name is required"],
    },
    variantCategory: {
      type: String,
      required: [true, "Variant Category is required"],
    },
    variantSpecification: Object,
    price: {
      type: Number,
      required: [true, "Variant Price is required"],
    },
    defaultOfferPercentage: Number,
    offers: Array,
    images: Array,
    description: {
      type: String,
    },
    specifications: Array,
  },
});
module.exports = mongoose.model("productVariant", productVariantSchema);
