const {body} = require("express-validator");
const validationSchema = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({min: 2})
      .withMessage("Name is too short"),
    body("price").notEmpty().withMessage("Price is required"),
  ];
};

module.exports = {validationSchema};
