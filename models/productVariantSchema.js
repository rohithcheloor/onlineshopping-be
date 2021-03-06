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
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "Product Id is required"],
    },
    variantName: {
      type: String,
      required: [true, "Variant Name is required"],
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
    availability: Boolean,
  },
});
module.exports = mongoose.model("productVariant", productVariantSchema);
