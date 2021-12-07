const express = require("express");

const userController = require("../controllers/userController.js");

const router = express.Router();

router.post("/user/create", userController.createUser);
router.put("/user/update", userController.updateUser);
router.delete("/user/delete", userController.deleteUser);
router.get("/user/all", userController.getAllUsers);

module.exports = router;
