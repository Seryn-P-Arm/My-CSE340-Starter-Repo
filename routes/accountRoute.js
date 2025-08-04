// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the Login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Deliver account management view
router.get(
  "/", 
  utilities.checkLogin,
  utilities.checkJWTToken,          // <-- Add this here
  utilities.handleErrors(accountController.buildManagement)
)

module.exports = router;