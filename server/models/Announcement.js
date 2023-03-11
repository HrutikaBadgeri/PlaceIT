const mongoose = require("mongoose");
require("dotenv").config();
const AnnouncementSchema = new mongoose.Schema({
  companyID: {
    type: String,
    trim: true,
    required: [true, "must provide an ID"],
    unique: false,
    maxlength: [20, "company ID cannot be more than 20 characters"],
  },
  announcementText: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  announcementPDF: {
    type: Buffer,
    contentType: String,
  },
  announcementImage: {
    type: Buffer,
    contentType: String,
  },
  announcementFileLink: {
    type: String,
    required: false,
    trim: true,
  },
});

module.exports = mongoose.model("AnnoucementSchema", AnnouncementSchema);
