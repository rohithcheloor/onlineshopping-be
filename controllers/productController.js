const product = require("../models/productSchema");
const user = require("../models/userSchema");
const errorGenerator = require("../utils/errorGenerator");
const { validateToken } = require("../utils/tokenValidator");

const createProduct = async (req, res) => {
  const isAuthorized = await validateToken(req);
  if (isAuthorized) {
    const authToken = req.headers.authorization.split(" ")[1];
    const sellerDetails = await user.findOne({
      "authInfo.tokens.token": authToken,
    });
    const reqData = req.body;
    reqData.sellerId = sellerDetails._id;
    const productDetails = await product.create(reqData);
    if (productDetails) {
      return res.status(200).json({
        success: true,
        _id: productDetails._id,
        message: "Product created Successfully!",
        product: productDetails,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: errorGenerator(103, "product"),
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: errorGenerator(401, "auth"),
    });
  }
};

const getAllProducts = async (req, res) => {
  const productList = await product.find({});
  if (!productList) {
    return res.status(404).json({
      success: false,
      message: errorGenerator(404, "product"),
    });
  } else {
    return res.status(200).json({
      success: true,
      data: productList,
      message: "Fetched all Products",
    });
  }
};

const getProductById = async (req, res) => {
  const productList = await product.findById(req.params.id);
  if (!productList) {
    return res.status(404).json({
      success: false,
      message: errorGenerator(404, "product"),
    });
  } else {
    return res.status(200).json({
      success: true,
      productData: productList,
      message: "Fetched Product Details",
    });
  }
};

module.exports = { createProduct, getAllProducts, getProductById };
