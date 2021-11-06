const express = require("express");

const registerController = require("../controllers/registerController.js");

const router = express.Router();

router.post("/user/create", registerController.createUser);
router.post("/user/update", registerController.updateUser);
router.post("/user/delete", registerController.deleteUser);
router.get("/user/all", registerController.getAllUsers);

module.exports = router;
