const express = require("express");

const authController = require("../controllers/authController.js");

const router = express.Router();

router.post("/auth/login", authController.loginUser);
router.post("/auth/logout", authController.logoutUser);
// router.post("/auth/logout", authController.logout);

module.exports = router;
