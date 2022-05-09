const product = require("../models/productSchema");
const productVariant = require("../models/productVariantSchema");
const user = require("../models/userSchema");
const errorGenerator = require("../utils/errorGenerator");
const { validateToken } = require("../utils/tokenValidator");

const createProductVariant = async (req, res) => {
  const isAuthorized = await validateToken(req);
  if (isAuthorized) {
    if (
      req.body.productVariantDetails &&
      req.body.productVariantDetails.productId
    ) {
      const productDetails = await product.findById(
        req.body.productVariantDetails.productId
      );
      if (!productDetails) {
        return res.status(404).json({
          success: false,
          message: errorGenerator(404, "product"),
        });
      }
      const reqData = req.body;
      if (
        reqData.productVariantDetails &&
        reqData.productVariantDetails.variantSpecification &&
        productDetails.variantCategories &&
        Object.keys(productDetails.variantCategories).length > 0
      ) {
        Object.keys(reqData.productVariantDetails.variantSpecification).forEach(
          (item) => {
            if (!Object.keys(productDetails.variantCategories).includes(item)) {
              return res.status(404).json({
                success: false,
                err: item,
                message: errorGenerator(400, "productVariant"),
              });
            }
          }
        );
      } else {
        return res.status(404).json({
          success: false,
          message: errorGenerator(404, "productVariant"),
        });
      }
      const productVariantDetails = await productVariant.create(reqData);
      if (productVariantDetails) {
        return res.status(200).json({
          success: true,
          _id: productVariantDetails._id,
          message: "Product created Successfully!",
          product: productDetails,
          variant: productVariantDetails,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: errorGenerator(103, "product"),
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: errorGenerator(404, "product"),
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: errorGenerator(401, "product"),
    });
  }
};
module.exports = { createProductVariant };
