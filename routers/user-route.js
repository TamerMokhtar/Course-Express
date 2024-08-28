const express = require("express");

const usersController = require("../controllers/users-controller.js");
const verifyToken = require("../middlewares/verifyToken.js");
const router = express.Router();
const multer = require("multer");
const appError = require("../utils/appError.js");

// multer configuration for file storage
const diskStorge = multer.diskStorage({
  destination: (req, res, cd) => {
    cd(null, "uploads");
  },
  filename: (req, file, cd) => {
    const fileName = `user-${Date.now()}${file.originalname}`;
    cd(null, fileName);
  },
});
// file filter for images
const fileFilter = (req, file, cd) => {
  const imageTypes = file.mimetype.split("/")[0];
  if (imageTypes === "image") {
    return cd(null, true);
  } else {
    return cd(appError.create("File must be an image", 400), false);
  }
};
// multer middleware for file uploads
const uploads = multer({ storage: diskStorge, fileFilter });

// CRUD => (Create / Read / Update / Delete)

router
  .route("/")
  //Get all users
  .get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  // register user
  .post(uploads.single("avatar"), usersController.register);

router
  .route("/login")
  // login user
  .post(usersController.login);

module.exports = router;
