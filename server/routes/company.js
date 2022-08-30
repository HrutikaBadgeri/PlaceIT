const express = require("express");
const router = express.Router();
const protect = require("../middleware/companyAuth");
const {
  getAllCompanies,
  addCompany,
  login,
  getCompanyToken,
  updateDetails,
  logout,
  forgotPassword,
  updatePassword,
  getOneCompany,
} = require("../controllers/company");

router.route("/getAllCompanies").get(getAllCompanies);
router.route("/register").post(addCompany);
router.route("/getCompanyToken").get(protect, getCompanyToken);
router.route("/getOneCompany").post(getOneCompany);
router.route("/login").post(login);
router.route("/updateDetails").patch(protect, updateDetails);
router.route("/forgotPassword").post(forgotPassword);
router.route("/updatePassword").put(protect, updatePassword);
router.route("/logout").get(protect, logout);
module.exports = router;
