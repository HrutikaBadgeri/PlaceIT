const jwt = require("jsonwebtoken");
const asyncWrapper = require("./async");
const Company = require("../models/Company");
const { createCustomError } = require("../errors/error-handler");
require("dotenv").config();

//Protecting the routes
const protect = asyncWrapper(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  //checking if token exists
  if (!token) {
    return next(createCustomError("Not authorized to access this route", 401));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.company = await Company.findById(decodedToken.id);
    next();
  } catch (error) {
    console.log(error);
    return next(createCustomError("Protected route", 401));
  }
});
module.exports = protect;
