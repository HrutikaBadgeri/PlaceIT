const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/error-handler");
require("dotenv").config();
const Announcement = require("../models/Announcement");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

//@description create new announcement
//@route POST /api/v1/announcement/createAnnouncement
//@access company access
const createAnnouncement = asyncWrapper(async (req, res) => {
  var obj = {
    companyID: req.company.companyID,
    announcementText: req.body.announcementText,
    announcementFileLink: req.body.announcementFileLink,
  };
  // if (req.files.announcementPDF) {
  //   excelToPdf(req.announcementPDF[0].filename);
  //   obj = {
  //     ...obj,
  //     announcementPDF: {
  //       data: fs.readFileSync(
  //         path.join(
  //           __dirname.split("\\").slice(0, -1).join("\\") +
  //             "/announcements/" +
  //             req.files.announcementPDF[0].filename
  //         )
  //       ),
  //       contentType: "announcement/pdf",
  //     },
  //   };
  // }
  // if (req.files.announcementImage) {
  //   obj = {
  //     ...obj,
  //     announcementImage: {
  //       data: fs.readFileSync(
  //         path.join(
  //           __dirname.split("\\").slice(0, -1).join("\\") +
  //             "/announcements/" +
  //             req.files.announcementImage[0].filename
  //         )
  //       ),
  //       contentType: "announcement/jpeg",
  //     },
  //   };
  // }
  const announcement = await Announcement.create(obj);
  // // Delete the file like normal
  // // await unlinkAsync(req.file.path);
  res.status(200).json({ success: true, data: announcement });
});

//@description get latest announcement
//@route POST /api/v1/announcement/getAnnouncement
//@access student access
const getAnnouncement = asyncWrapper(async (req, res) => {
  const announcement = await Announcement.find({
    companyID: req.body.companyID,
  }).sort("createdAt");
  res.status(200).json({ success: true, data: announcement });
});

//@description update an announcement
//@route POST /api/v1/announcement/updateAnnouncement
//@access company access
const updateAnnouncement = asyncWrapper(async (req, res, next) => {
  const updatedAnnouncement = req.body.updatedAnnouncement;
  const _id = req.body._id;
  const announcement = await Announcement.findOneAndUpdate(
    { _id: _id },
    {
      announcementText: updatedAnnouncement,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: announcement });
});

//@description delete an announcement
//@route DELETE /api/v1/announcement/deleteAnnouncement
//@access company access
const deleteAnnouncement = asyncWrapper(async (req, res, next) => {
  const _id = req.body._id;
  const announcement = await Announcement.findByIdAndDelete(_id);
  res.status(200).json({ success: true, data: announcement });
});

const excelToPdf = (filename) => {
  const { PdfSaveOptions, Workbook, PdfCompliance } = require("aspose.cells");

  path = __dirname.split("\\").slice(0, -1).join("\\") + "/announcements/";
  // load a workbook
  var workbook = Workbook(path + filename);

  // create and set PDF options
  pdfOptions = PdfSaveOptions();
  pdfOptions.setCompliance(PdfCompliance.PDF_A_1_B);

  // convert Excel to PDF
  workbook.save(path + filename + "- Converted.pdf", pdfOptions);
};

module.exports = {
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
