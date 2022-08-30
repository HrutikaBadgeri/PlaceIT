const asyncWrapper = require("../middleware/async");
const Company = require("../models/Company");
const { createCustomError } = require("../errors/error-handler");
// const { create } = require("../models/Company");
require("dotenv").config();

const getAllCompanies = asyncWrapper(async (req, res) => {
  const { sort } = req.query;
  let sortList;
  if (sort) {
    sortList = sort.split(",").join(" ");
  }
  const companies = await Company.find({}).sort(sortList);
  // res.status(200).json({companies})
  res.status(200).json({ success: true, data: companies });
});

//@description get single company
//@route
//@access public
const getOneCompany = asyncWrapper(async (req, res, next) => {
  const company = await Company.findOne(req.body);
  if (!company) {
    return next(
      createCustomError("Company with this name does not exist", 400)
    );
  }
  res.status(200).json({ success: true, data: company });
});

//@description Register a new company
//@route POST /api/v1/company/register
//@access public
const addCompany = asyncWrapper(async (req, res) => {
  const company = await Company.create(req.body);
  sendTokenResponse(company, 200, res);
});

//@description Login a company
//@route POST /api/v1/company/login
//@access public
const login = asyncWrapper(async (req, res, next) => {
  const { companyID, companyPassword } = req.body;

  //validation
  if (!companyID || !companyPassword) {
    return next(
      createCustomError("Please add a companyID and a company password", 400)
    );
  }
  //check if company exists in the database
  const company = await Company.findOne({ companyID }).select(
    "+companyPassword"
  );
  if (!company) {
    return next(
      createCustomError("Company with this credentials does not exist", 401)
    );
  }
  //check if password matches the hashed password in db
  const isMatch = await company.matchPassword(companyPassword);
  if (!isMatch) {
    return next(createCustomError("Incorrect Password", 401));
  }
  sendTokenResponse(company, 200, res); //the company has successfully logged in correct credentials!
});

//@description Logout
//@route POST /api/v1/company/logout
//@access private
const logout = asyncWrapper(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

//@description Get current logged in user token
//@route POST /api/v1/company/getCompanyToken
//@access private
const getCompanyToken = asyncWrapper(async (req, res, next) => {
  // const company = await Company.findById(req.company._id.toString());
  console.log(req.cookies);
  const token = req.cookies.token;
  res.status(200).json({ success: true, data: req.company, token });
});

//@description UPDATE currently logged in company's details
//@route PATCH /api/v1/company/register
// @access private
const updateDetails = asyncWrapper(async (req, res, next) => {
  let fieldsToUpdate = {};
  const {
    companyID,
    companyName,
    companyEmail,
    companyDescription,
    jobTitle,
    packageOffering,
    jobLocation,
    hiringBranches,
  } = req.body;
  if (companyID) {
    fieldsToUpdate = { ...fieldsToUpdate, companyID };
  }
  if (companyName) {
    fieldsToUpdate = { ...fieldsToUpdate, companyName };
  }
  if (companyEmail) {
    fieldsToUpdate = { ...fieldsToUpdate, companyEmail };
  }
  if (companyDescription) {
    fieldsToUpdate = { ...fieldsToUpdate, companyDescription };
  }
  if (jobTitle) {
    fieldsToUpdate = { ...fieldsToUpdate, jobTitle };
  }
  if (packageOffering) {
    fieldsToUpdate = { ...fieldsToUpdate, packageOffering };
  }
  if (jobLocation) {
    fieldsToUpdate = { ...fieldsToUpdate, jobLocation };
  }
  if (hiringBranches) {
    fieldsToUpdate = { ...fieldsToUpdate, hiringBranches };
  }
  const company = await Company.findByIdAndUpdate(
    req.company._id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: company });
});

//@description Forgot password
//@route POST /api/v1/company/forgotPassword
//@access public
const forgotPassword = asyncWrapper(async (req, res, next) => {
  const company = await Company.findOne({
    companyEmail: req.body.companyEmail,
  });
  if (!company) {
    return next(
      createCustomError("There is no user with that email which exists", 404)
    );
  }
  //Get reset token
  const resetToken = company.getResetPasswordToken();
  console.log(resetToken);
  await company.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, data: company });
});

//@description UPDATE currently logged in user's password
//@route PUT /api/v1/company/updatePassword
//@access private
const updatePassword = asyncWrapper(async (req, res, next) => {
  const company = await Company.findById(req.company.id).select(
    "+companyPassword"
  );
  //if the current password and new password are not entered
  if (!req.body.currentCompanyPassword || !req.body.newCompanyPassword) {
    return next(
      createCustomError(
        "Incomplete details, please enter current and new password",
        401
      )
    );
  }
  //check current password
  if (!(await company.matchPassword(req.body.currentCompanyPassword))) {
    return next(createCustomError("Password is incorrect", 401));
  }
  company.companyPassword = req.body.newCompanyPassword;

  company.save();
  sendTokenResponse(company, 200, res);
});

//Get token from model, create a cookie and send response
const sendTokenResponse = (company, statusCode, res) => {
  //create a token
  const token = company.getSignedJWTToken();
  const expireTime = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  );
  const options = {
    expires: expireTime,
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

module.exports = {
  getAllCompanies,
  addCompany,
  login,
  logout,
  updateDetails,
  getCompanyToken,
  forgotPassword,
  updatePassword,
  getOneCompany,
};
