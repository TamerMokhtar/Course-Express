const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRole.USER, userRole.ADMIN, userRole.MANAGER],
    default: userRole.USER,
  },
  avatar: {
    type: String,
    default: "http://localhost:3001/uploads/profile.png",
  },
});

module.exports = mongoose.model("User", userSchema);
