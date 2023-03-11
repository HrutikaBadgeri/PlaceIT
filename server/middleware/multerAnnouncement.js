// multer basically is a middleware that will check the files that have been uploaded, are uploaded in proper format and upto the given filesize
const { createCustomAPIError } = require("../errors/error-handler");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "announcements");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".").slice(0, -1).join(".") +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(xlsx|png)$/)) {
      //upload only in pdf format
      return cb(createCustomAPIError(401, "Please upload a JSON file"));
    }
    cb(undefined, true);
  },
});
module.exports = upload;
