const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatus = require("../utils/httpStatusText");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  // get all Users from DB using Course Model

  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false }) // exclude password:false and __v fields
    .limit(limit)
    .skip(skip);
  res.status(200).json({ status: httpStatus.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role, avatar } = req.body;

  // check if user already exists
  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create("User already exists", 400, httpStatus.FAIL);
    return next(error);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // check if avatar is provided and return the avatar url
  // function getAvatarLocal(file) {
  //   if (process.env.LOCAL_HOST && file && file.filename) {
  //     return `${process.env.LOCAL_HOST}/uploads/${file.filename}`;
  //   }

  //   return `${process.env.LOCAL_HOST}/uploads/profile.jpg`;
  // }
  function getAvatarUrl(file) {
    if (file && file.filename) {
      return `uploads/${file.filename}`;
    }

    return `uploads/profile.jpg`;
  }

  // Create a new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: getAvatarUrl(req.file), // Add the avatar to the user in Localhost
  });

  // Generate a token
  const token = await generateJWT({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });
  newUser.token = token;

  // save user to DB
  await newUser.save();
  res.status(201).json({ status: httpStatus.SUCCESS, data: { newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password are provided
  if (!email && !password) {
    const error = appError.create(
      "Email and password are required",
      400,
      httpStatus.FAIL
    );
    return next(error);
  }
  // Find the user by email
  const user = await User.findOne({ email: email });
  // check if user exists
  if (!user) {
    const error = appError.create("User not found", 404, httpStatus.FAIL);
    return next(error);
  }
  // check if password is correct
  const matchedPassword = await bcrypt.compare(password, user.password);
  // if user exists and password is correct, return user
  if (user && matchedPassword) {
    const token = await generateJWT({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    res.status(200).json({ status: httpStatus.SUCCESS, data: { token } });
  } else {
    const error = appError.create(
      "Something want wrong",
      500,
      httpStatus.ERROR
    );
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
