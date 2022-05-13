const express = require("express");

const productController = require("../controllers/productController");
const productVariantController = require("../controllers/productVariantController");

const router = express.Router();

router.get("/product/variant/all", productVariantController.getAllVariants);
router.post("/product/create", productController.createProduct);

router.post(
  "/product/variant/create",
  productVariantController.createProductVariant
);
router.put(
  "/product/variant/update",
  productVariantController.updateProductVariant
);
module.exports = router;
