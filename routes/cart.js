const express = require("express");

const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/cart/add", cartController.addToCart);

module.exports = router;
