const express = require("express");
const connectDB = require("./db/connect");
const app = express();
const company = require("./routes/company");
const notFound = require("./middleware/not-found");
const cookieParser = require("cookie-parser");
const student = require("./routes/student");
const colors = require("colors");
const application = require("./routes/application");
const announcement = require("./routes/announcement");
const tpo = require("./routes/tpo");
require("dotenv").config();
// const bodyParser = require("body-parser");

//Cookie parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/v1/company", company);
app.use("/api/v1/student", student);
app.use("/api/v1/application", application);
app.use("/api/v1/tpo", tpo);
app.use("/api/v1/announcement", announcement);
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
