const asyncWrapper = require("../middleware/async");
const Application = require("../models/Application");
const { createCustomError } = require("../errors/error-handler");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
// import { unlink } from 'node:fs';

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
  await fs.unlink(
    path.join(
      __dirname.split("\\").slice(0, -1).join("\\") +
        "/resumes/" +
        req.file.filename
    ),
    (err) => {
      if (err) throw err;
    }
  );
  res.status(200).json({ success: true, data: application });
});

//@description get all applications
//@route GET /api/v1/application/getAllApplication
//@access company access
const getAllApplication = asyncWrapper(async (req, res) => {
  const { sort } = req.query;
  const fields = {};
  const { TPOStatus, CompanyStatus } = req.body;
  if (TPOStatus) {
    fields = { ...fields, TPOStatus };
  }
  if (CompanyStatus) {
    fields = { ...fields, CompanyStatus };
  }
  let result = Application.find(fields);
  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }
  const application = await result;
  res.status(200).json({ success: true, data: application });
});

//@description accept or reject applicaiton by college TPO
//@route PATCH /api/v1/application/applicationStatus
//@access company access
const TPOStatus = asyncWrapper(async (req, res) => {
  const { applicationID, newTPOStatus } = req.body;
  const application = await Application.findByIdAndUpdate(
    applicationID.toString(),
    {
      applicationStatus: newTPOStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: application });
});

//@description accept or reject applicaiton by the company HR
//@route PATCH /api/v1/application/CompanyStatus
//@access company access
const CompanyStatus = asyncWrapper(async (req, res) => {
  const { applicationID, newCompanyStatus } = req.body;
  const application = await Application.findByIdAndUpdate(
    applicationID.toString(),
    {
      applicationStatus: newCompanyStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: application });
});
//@description Generate CSV Data of applications
//@route GET /api/v1/application/generateCSV
//@access TPO and company access
const generateCSV = asyncWrapper(async (req, res, next) => {
  if (req.company) {
    var { companyID } = req.company;
    var applications = await Application.find({
      companyStatus: "Accepted",
      tpoStatus: "Accepted",
      companyID: companyID,
    }).select(["-uploadResume", "-_id", "-__v"]);
  } else if (req.tpo) {
    var { companyID } = req.query;
    var applications = await Application.find({
      tpoStatus: "Accepted",
      companyID: companyID,
    }).select(["-uploadResume", "-_id", "-__v"]);
  }
  const json2csvParser = new Json2csvParser({ header: true });
  const csvData = json2csvParser.parse(
    JSON.parse(JSON.stringify(applications))
  );

  const filename = companyID + "-" + Date.now() + ".csv";
  fs.writeFile("./applications/" + filename, csvData, function (error) {
    if (error) throw error;
    // console.log("Ho gaya bhai ho gaya");
  });
  res.download(
    path.join(
      __dirname.split("\\").slice(0, -1).join("\\") +
        "/applications/" +
        filename
    )
  );
});

module.exports = {
  createApplication,
  TPOStatus,
  CompanyStatus,
  getAllApplication,
  generateCSV,
};
