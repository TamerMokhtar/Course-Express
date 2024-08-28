const jwt = require("jsonwebtoken");

const httpStatus = require("../utils/httpStatusText.js");
const appError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create("Token is require", 401, httpStatus.ERROR);
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    // Verify the token (Decode the token)
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("Invalid token", 401, httpStatus.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
