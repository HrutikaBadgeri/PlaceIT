const mongoose = require("mongoose");
require("dotenv").config();
const ApplicationSchema = new mongoose.Schema({
  companyID: {
    type: String,
    trim: true,
    required: [true, "must provide an ID"],
    unique: true,
    maxlength: [20, "company ID cannot be more than 20 characters"],
  },
  studentID: {
    type: String,
    trim: true,
    required: [true, "must provide an ID"],
    unique: true,
    maxlength: [20, "studentID cannot be more than 20 characters"],
  },
  studentContact: {
    type: String,
    required: [true],
    trim: true,
    unique: true,
    maxlength: [10, "phone number cannot be greater than 10 digits"],
    minlength: [10, "phone number cannot be less than 10 digits"],
  },
  studentName: {
    type: String,
    required: [true, "must provide a name"],
    trim: true,
    maxLength: [30, "name cannot be more than 30 characters"],
  },
  studentEmail: {
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
  AverageCGPA: {
    type: Number,
    required: [true, "must provide the average CGPA"],
    trim: true,
    min: 0,
    max: 10,
  },
  keySkills: {
    type: String,
    required: [true, "key skiils are required"],
    trim: true,
    minlength: [1, "skills cannot  be less than 1 character"],
  },
  studentAddress: {
    type: String,
    required: [true, "necessary to provide an addres"],
    trim: true,
    minleght: [5, "address length should not be less than 5"],
    maxlength: [100, "address length should not be greater than 100"],
  },
  verifiedApplication: {
    type: Boolean,
    default: false,
  },
  uploadResume: {
    type: String,
    required: [true, "must provide a resume with the applicaiton "],
  },
});
modules.exports = ApplicationSchema;
