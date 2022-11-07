const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const studentProtect = require("../middleware/studentAuth");
const companyProtect = require("../middleware/companyAuth");
const {
  applicationStatus,
  getAllApplication,
  createApplication,
} = require("../controllers/application");

router.route("/getAllApplication").get(companyProtect, getAllApplication);
router
  .route("/createApplication")
  .post(studentProtect, upload.single("resume"), createApplication);
router.route("/applicationStatus").patch(companyProtect, applicationStatus);

module.exports = router;
