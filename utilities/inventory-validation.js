const { body, validationResult } = require("express-validator");

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Classification name is required.")
      .isAlpha().withMessage("Only letters allowed. No spaces or special characters.")
  ];
};

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await require("./index").getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      messages: null,
      errors: errors.array(),
      nav,
    });
    return;
  }
  next();
};

module.exports = { classificationRules, checkClassificationData };
