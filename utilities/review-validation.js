// Validate Object
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const loadVehicleDetail = require("./loadVehicleDetail");
  
const validate = {}


/*  **********************************
*  Add Review Validation Rules
* ********************************* */
validate.addReviewRules = () => {
    return [
        // review text is required and must be string
        body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a review."), // on error this message is sent.
    ]
}

/* ******************************
* Check data and return errors or continue to add review
* ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const inv_id = req.body.inv_id;

    try {
      const { vehicleData, average_rating, reviews } = await loadVehicleDetail(inv_id);

      const grid = await utilities.buildVehicleDetailGrid(vehicleData);
        
      res.render("./inventory/detail", {
        title: `${vehicleData.inv_make} ${vehicleData.inv_model} Details`,
        nav,
        grid,
        vehicle: vehicleData,
        average_rating,
        review_text: req.body.review_text,
        reviews,
        accountData: res.locals.accountData,
        errors
      });
      return;
    } catch (err) {
      console.error("Error loading vehicle detail for validation:", err);
      req.flash("error", "Please enter text in the review before submitting.");
      res.redirect(`/inv/detail/${inv_id}`);
      return;
    }
  }
  next();
};

module.exports = validate