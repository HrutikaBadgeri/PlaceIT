const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const StudentSchema = new mongoose.Schema({
  studentID: {
    type: String,
    trim: true,
    required: [true, "must provide an ID"],
    unique: true,
    maxlength: [20, "studentID cannot be more than 20 characters"],
  },
  studentGender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    trim: true,
    required: [true, "must mention a gender"],
  },
  studentPassword: {
    type: String,
    select: false,
    required: [true, "must provide a password"],
    maxlength: [15, "password cannot be more than 10 characters"],
    minlength: [7, "password cannot be less then 7 characters"],
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
  studentContact: {
    type: String,
    required: [true],
    trim: true,
    unique: true,
    maxlength: [10, "phone number cannot be greater than 10 digits"],
    minlength: [10, "phone number cannot be less than 10 digits"],
  },
  studentBranch: {
    type: String,
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
    trim: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
//Hashing the password before storing it in the database
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("studentPassword")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.studentPassword = await bcrypt.hash(this.studentPassword, salt);
});

//match hash password with user entered password
StudentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.studentPassword);
};

StudentSchema.methods.getSignedJWTToken = function () {
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
StudentSchema.methods.getResetPasswordToken = function () {
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

module.exports = mongoose.model("StudentSchema", StudentSchema);
