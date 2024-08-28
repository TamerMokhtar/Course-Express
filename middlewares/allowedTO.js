const appError = require("../utils/appError");

module.exports = (...roles) => {
  // ['admin', 'manager']

  return (req, res, next) => {
    // req.user = { role: 'admin' }
    if (!roles.includes(req.user.role)) {
      const error = appError.create(
        "This role is not authorized to access this route",
        401,
      );
      next();
    }
  };
};
