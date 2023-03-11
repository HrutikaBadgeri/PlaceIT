const asyncWrapper = require("../middleware/async");
const TPO = require("../models/TPO");
const { createCustomError } = require("../errors/error-handler");
// const { create } = require("../models/Company");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//@description Login tpo
//@route POST /api/v1/tpo/login
//@access public
const login = asyncWrapper(async (req, res, next) => {
  const { userName, userPassword } = req.body;

  //validation
  if (!userName || !userPassword) {
    return next(
      createCustomError("Please add a userID and a user password", 400)
    );
  }
  //check if company exists in the database
  const tpo = await TPO.findOne({ userName }).select("+userPassword");
  if (!tpo) {
    return next(
      createCustomError("User with this credentials does not exist", 401)
    );
  }
  //check if password matches the hashed password in db
  const isMatch = await tpo.matchPassword(userPassword);
  if (!isMatch) {
    return next(createCustomError("Incorrect Password", 401));
  }
  sendTokenResponse(tpo, 200, res); //the company has successfully logged in correct credentials!
});

//@description Register a new tpo
//@route POST /api/v1/tpo/register
//@access public
const addTPO = asyncWrapper(async (req, res) => {
  const tpo = await TPO.create(req.body);
  sendTokenResponse(tpo, 200, res);
});

//@description Logout
//@route POST /api/v1/TPO/logout
//@access private
const logout = asyncWrapper(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

//@description UPDATE currently logged in user's password
//@route PUT /api/v1/TPO/updatePassword
//@access private
const updatePassword = asyncWrapper(async (req, res, next) => {
  const tpo = await TPO.findById(req.tpo._id.toString()).select(
    "+userPassword"
  );
  //if the current password and new password are not entered
  if (!req.body.currentuserPassword || !req.body.newuserPassword) {
    return next(
      createCustomError(
        "Incomplete details, please enter current and new password",
        401
      )
    );
  }
  //check current password
  if (!(await tpo.matchPassword(req.body.currentuserPassword))) {
    return next(createCustomError("Password is incorrect", 401));
  }
  tpo.userPassword = req.body.newuserPassword;

  tpo.save();
  sendTokenResponse(tpo, 200, res);
});

//Get token from model, create a cookie and send response
const sendTokenResponse = (tpo, statusCode, res) => {
  //create a token
  const token = tpo.getSignedJWTToken();
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
//@description Forgot password
//@route POST /api/v1/company/forgotPassword
//@access public
const forgotPassword = asyncWrapper(async (req, res, next) => {
  const tpo = await TPO.findOne({
    userEmail: req.body.userEmail,
  });
  if (!tpo) {
    return next(createCustomError("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = tpo.getResetPasswordToken();

  await tpo
    .save({ validateBeforeSave: false })
    .then((tpo) => {
      let link =
        "http://" + req.headers.host + "/api/v1/user/auth/reset/" + resetToken;
      const mailOptions = {
        to: tpo.userEmail,
        from: process.env.FROM_EMAIL,
        subject: "Password change request",
        text: `Hi ${tpo.userName} \n 
        Please click on the following link ${link} to reset your password. \n\n 
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      sgMail.send(mailOptions, (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        res.status(200).json({
          message: "A reset email has been sent to " + tpo.userEmail + ".",
        });
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

module.exports = {
  login,
  logout,
  forgotPassword,
  updatePassword,
  addTPO,
};
