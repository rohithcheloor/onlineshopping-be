const express = require("express");

const productController = require("../controllers/productController");
const productVariantController = require("../controllers/productVariantController");

const router = express.Router();

router.post("/product/create", productController.createProduct);

router.post(
  "/product/variant/create",
  productVariantController.createProductVariant
);

module.exports = router;
