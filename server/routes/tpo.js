const express = require("express");
const router = express.Router();
const protect = require("../middleware/tpoAuth");
const {
  login,
  logout,
  updatePassword,
  forgotPassword,
  addTPO,
} = require("../controllers/tpo");

router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/updatePassword").put(protect, updatePassword);
router.route("/logout").get(protect, logout);
router.route("/register").post(addTPO);

module.exports = router;
