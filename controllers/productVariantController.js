const product = require("../models/productSchema");
const productVariant = require("../models/productVariantSchema");
const user = require("../models/userSchema");
const errorGenerator = require("../utils/errorGenerator");
const { validateToken } = require("../utils/tokenValidator");

const getAllVariants = async (req, res) => {
  const productList = await productVariant.find({});
  return res.status(200).json({
    success: true,
    data: productList,
    message: "Fetched all Product Variants",
  });
};

const getProductVariantsByProductId = async (req, res) => {
  const variantList = await productVariant.find({
    "productVariantDetails.productId": req.params.id,
  });
  if (!variantList) {
    return res.status(404).json({
      success: false,
      message: errorGenerator(404, "product"),
    });
  } else {
    return res.status(200).json({
      success: true,
      productVariants: variantList,
      message: "Fetched Product variants successfully",
    });
  }
};

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
        const specValidation = Object.keys(
          reqData.productVariantDetails.variantSpecification
        ).filter(
          (item) =>
            !Object.keys(productDetails.variantCategories).includes(item)
        );
        if (specValidation && specValidation.length > 0) {
          return res.status(404).json({
            success: false,
            err: specValidation,
            message: errorGenerator(100, "productVariant"),
          });
        }
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
      message: errorGenerator(401, "auth"),
    });
  }
};

const updateProductVariant = async (req, res) => {
  const isAuthorized = await validateToken(req);
  if (isAuthorized) {
    const reqBody = req.body;
    if (reqBody.productVariantDetails) {
      //Product ID,Variant Name, Specifications and Descriptions are not updatable
      delete reqBody.productVariantDetails.productId;
      delete reqBody.productVariantDetails.variantName;
      delete reqBody.productVariantDetails.variantSpecification;
      delete reqBody.productVariantDetails.description;
    }
    if (reqBody._id) {
      await productVariant
        .findOneAndUpdate({ _id: reqBody._id }, reqBody)
        .then(
          () => {
            return res.status(200).json({
              success: true,
              _id: reqBody._id,
              message: "Product variant updated Successfully!",
              variant: reqBody,
            });
          },
          (err) => {
            return res.status(500).json({
              success: false,
              message: errorGenerator(105, "product"),
              err: err,
            });
          }
        )
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: errorGenerator(105, "product"),
            err: err,
          });
        });
    } else {
      return res.status(500).json({
        success: false,
        message: errorGenerator(404, "productVariant"),
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: errorGenerator(401, "auth"),
    });
  }
};
module.exports = {
  getAllVariants,
  createProductVariant,
  updateProductVariant,
  getProductVariantsByProductId,
};
