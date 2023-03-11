const express = require("express");
const router = express.Router();
const companyProtect = require("../middleware/companyAuth");
const upload = require("../middleware/multerAnnouncement");
const {
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement");
const companyAuth = require("../middleware/companyAuth");

router.route("/getAnnouncement").post(companyAuth, getAnnouncement);
router
  .route("/createAnnouncement")
  .post(companyProtect, upload.single("announcementImage"), createAnnouncement);
// router.route("/createAnnouncement").post(companyProtect, createAnnouncement);
router.route("/updateAnnouncement").patch(companyProtect, updateAnnouncement);
router.route("/deleteAnnouncement").delete(companyProtect, deleteAnnouncement);

module.exports = router;
