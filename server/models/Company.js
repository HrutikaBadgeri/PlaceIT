const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const CompanySchema = new mongoose.Schema({
  companyID: {
    type: String,
    trim: true,
    required: [true, "must provide an ID"],
    unique: true,
    maxlength: [20, "company ID cannot be more than 20 characters"],
  },
  companyPassword: {
    type: String,
    required: [true, "must provide a password"],
    maxlength: [15, "password cannot be more than 10 characters"],
    minlength: [7, "password cannot be less then 7 characters"],
  },

  companyName: {
    type: String,
    required: [true, "must provide a name"],
    trim: true,
    maxLength: [30, "name cannot be more than 30 characters"],
  },
  companyEmail: {
    type: String,
    required: [true, "must provide an email"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "please fill a valid email address",
    ],
  },
  companyDescription: {
    type: String,
    required: [true, "must provide a company description"],
    maxlength: [100, "description cannot be more than 50 characters"],
  },
  jobTitle: {
    type: String,
    required: [true, "must provide a job title"],
    maxlength: [20, "job title cannot be more than 20 characters"],
  },
  packageOffering: {
    type: Number,
    required: [true, "must provide a package"],
  },
  jobLocation: {
    type: String,
    required: [true, "must provide a job location"],
    trim: true,
  },
  hiringBranches: {
    type: [String],
    enum: [
      "Computer",
      "InformationTechnology",
      "Mechanical",
      "Mechatronics",
      "Civil",
      "Electronics",
      "Electronics and Telecommunications",
    ],
    required: [true],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//Hashing the password before storing it in the database
CompanySchema.pre("save", async function (next) {
  if (!this.isModified("companyPassword")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.companyPassword = await bcrypt.hash(this.companyPassword, salt);
});

//match hash password with user entered password
CompanySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.companyPassword);
};

CompanySchema.methods.getSignedJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

//Get the reset password token
CompanySchema.methods.getResetPasswordToken = function () {
  //generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hash token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //set expiry date of token
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("CompanySchema", CompanySchema);
