const asyncWrapper = require("../middleware/async");
const Application = require("../models/Application");
const { createCustomError } = require("../errors/error-handler");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

//@description create new application
//@route POST /api/v1/application/application
//@access student access
const createApplication = asyncWrapper(async (req, res) => {
  var obj = {
    companyID: req.body.companyID,
    studentID: req.body.studentID,
    studentContact: req.body.studentContact,
    studentName: req.body.studentName,
    studentEmail: req.body.studentEmail,
    averageCGPA: req.body.averageCGPA,
    keySkills: req.body.keySkills,
    studentAddress: req.body.studentAddress,
    studentBranch: req.body.studentBranch,
    applicationStatus: req.body.applicationStatus,
    uploadResume: {
      data: fs.readFileSync(
        path.join(
          __dirname.split("\\").slice(0, -1).join("\\") +
            "/resumes/" +
            req.file.filename
        )
      ),
      contentType: "resume/pdf",
    },
  };
  const application = await Application.create(obj);
  res.status(200).json({ success: true, data: application });
});

//@description get all applications
//@route GET /api/v1/application/getAllApplication
//@access company access
const getAllApplication = asyncWrapper(async (req, res) => {
  const application = await Application.find({});
  res.status(200).json({ success: true, data: application });
});

//@description accept or reject applicaiton
//@route PATCH /api/v1/application/applicationStatus
//@access company access
const applicationStatus = asyncWrapper(async (req, res) => {
  const { applicationID, newStatus } = req.body;
  const application = await Application.findByIdAndUpdate(
    applicationID.toString(),
    {
      applicationStatus: newStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: application });
});
module.exports = {
  createApplication,
  applicationStatus,
  getAllApplication,
};
