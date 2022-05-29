const express = require("express");

const productController = require("../controllers/productController");
const productVariantController = require("../controllers/productVariantController");

const router = express.Router();

router.post("/product/create", productController.createProduct);
router.get("/product/all", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.get("/product/variant/all", productVariantController.getAllVariants);
router.get(
  "/product/variant/:id",
  productVariantController.getProductVariantsByProductId
);
router.post(
  "/product/variant/create",
  productVariantController.createProductVariant
);
router.put(
  "/product/variant/update",
  productVariantController.updateProductVariant
);
module.exports = router;
