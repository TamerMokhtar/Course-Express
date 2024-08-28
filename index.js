require("dotenv").config(); // to use .env file
const express = require("express");
const app = express();
const port = 3001;
const httpStatus = require("./utils/httpStatusText");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const coursesRouter = require("./routers/courses-route.js");
const usersRouter = require("./routers/user-route.js");

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("mongodb server started");
});

//use middleware for static files for serving (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
//use middleware for BodyParser
app.use(express.json());

app.use("/api/courses", coursesRouter);

app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: httpStatus.ERROR,
    message: "The requested URL was not found on this server  ",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText || httpStatus.ERROR,
    message: err.message,
    code: err.statusCode || 500,
    data: null,
  });
});
app.listen(process.env.PORT || 3001, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
