// Validate Object
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

/*  **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
return [
    // valid email is required and must exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required."),

    // password is required
    body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password does not meet requirements."),
]
}

/* ******************************
 * Check data and return errors or continue to management
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
      account_password
    })
    return
  }
  next()
}

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
return [
    // firstname is required and must be string
    body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 * Account Update Validation Rules
 * ********************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required.")
      .isAlpha()
      .withMessage("First name must contain only letters."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required.")
      .isAlpha()
      .withMessage("Last name must contain only letters."),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const accountId = req.body.account_id
        const existingAccount = await require('../models/account-model').getAccountByEmail(email)
        if (existingAccount && existingAccount.account_id != accountId) {
          throw new Error("Email already in use.")
        }
        return true
      }),
  ]
}

/* **********************************
 * Password Update Validation Rules
 * ********************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character."
      ),
  ]
}

/* **********************************
 * Check data and return errors or continue for account update
 * ********************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const utilities = require(".")
    let nav = await utilities.getNav()
    res.render("account/update", {
      title: "Update Account",
      errors,
      nav,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
      account_id: req.body.account_id,
    })
    return
  }
  next()
}

/* **********************************
 * Check data and return errors or continue for password update
 * ********************************** */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const utilities = require(".")
    let nav = await utilities.getNav()
    res.render("account/update", {
      title: "Change Password",
      errors,
      nav,
      account_id: req.body.account_id,
    })
    return
  }
  next()
}

module.exports = validate