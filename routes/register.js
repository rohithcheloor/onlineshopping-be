const express = require("express");

const registerController = require("../controllers/registerController.js");

const router = express.Router();

router.post("/register/create", registerController.createUser);
router.post("/register/update", registerController.updateUser);
router.post("/register/delete", registerController.deleteUser);
router.get("/register/all", registerController.getAllUsers);

module.exports = router;
