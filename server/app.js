const express = require("express");
const connectDB = require("./db/connect");
const app = express();
const company = require("./routes/company");
const colors = require("colors");
const notFound = require("./middleware/not-found");
const cookieParser = require("cookie-parser");
const student = require("./routes/student");
require("dotenv").config();

//Cookie parser
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/api/v1/company", company);
app.use("/api/v1/student", student);
app.use(notFound);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(
      port,
      console.log(`server is listening on port ${port}...`.green.bold)
    );
  } catch (error) {
    console.log(error);
  }
};
const port = process.env.PORT || 3000;
start();
