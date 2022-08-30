const express = require("express");
const router = express.Router();
const protect = require("../middleware/studentAuth");
const {
  addStudent,
  login,
  logout,
  forgotPassword,
  updatePassword,
  updateDetails,
  getStudentToken,
} = require("../controllers/student");
router.route("/register").post(addStudent);
router.route("/login").post(login);
router.route("/getStudentToken").get(protect, getStudentToken);
router.route("/updateDetails").patch(protect, updateDetails);
router.route("/forgotPassword").post(forgotPassword);
router.route("/updatePassword").put(protect, updatePassword);
router.route("/logout").get(protect, logout);
module.exports = router;
