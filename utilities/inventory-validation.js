// Validate Object
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

/*  **********************************
*  Add Classification Data Validation Rules
* ********************************* */
validate.addClassificationRules = () => {
return [
    // classification name is required and must be string
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .matches(/^[A-Za-z\s\-]+$/)
    .withMessage("Please provide a classification name."), // on error this message is sent.
]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
*  Add Inventory Data Validation Rules
* ********************************* */
validate.addInventoryRules = () => {
  return [
    // Classification must be selected
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),

    // Make: Required, string, alphanumeric, up to 30 chars
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ max: 30 })
      .withMessage("Please provide a valid make (max 30 characters)."),

    // Model: Required, string, alphanumeric, up to 30 chars
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ max: 30 })
      .withMessage("Please provide a valid model (max 30 characters)."),

    // Year: Required, must be a valid year number
    body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Please provide a valid year (1900–2099)."),

    // Description: Required, string, min 10 characters
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a detailed description (min 10 characters)."),

    // Image: Required, should be a valid URL-ish string
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Please provide a valid image path."),

    // Thumbnail: Required, should be a valid URL-ish string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Please provide a valid thumbnail path."),

    // Price: Required, must be a number
    body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price (0 or higher)."),

    // Miles: Required, must be a number
    body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide a valid mileage (0 or higher)."),

    // Color: Required, alphabetic only, max 20 chars
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha('en-US', { ignore: ' ' })
      .isLength({ max: 20 })
      .withMessage("Please provide a valid color (letters only, max 20 characters).")
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  
  const sanitizePath = (path) =>
  path.replace(/(&amp;#x2F;|&#x2F;|&sol;)/g, '/');

  cleanedImage = sanitizePath(inv_image);
  cleanedThumbnail = sanitizePath(inv_thumbnail);

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image : cleanedImage,
      inv_thumbnail : cleanedThumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to edit inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  
  const sanitizePath = (path) =>
  path.replace(/(&amp;#x2F;|&#x2F;|&sol;)/g, '/');

  cleanedImage = sanitizePath(inv_image);
  cleanedThumbnail = sanitizePath(inv_thumbnail);

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image : cleanedImage,
      inv_thumbnail : cleanedThumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate