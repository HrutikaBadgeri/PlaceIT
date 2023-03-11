const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerResume");
const studentProtect = require("../middleware/studentAuth");
const companyProtect = require("../middleware/companyAuth");
const tpoProtect = require("../middleware/tpoAuth");
const mergedProtect = require("../middleware/mergedAuth");
const {
  TPOStatus,
  CompanyStatus,
  getAllApplication,
  createApplication,
} = require("../controllers/application");

router.route("/getAllApplication").get(mergedProtect, getAllApplication);
router
  .route("/createApplication")
  .post(studentProtect, upload.single("resume"), createApplication);
router.route("/TPOStatus").patch(tpoProtect, TPOStatus);
router.route("/CompanyStatus").patch(companyProtect, CompanyStatus);

module.exports = router;
