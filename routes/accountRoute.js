const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Login view and process
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Registration view and process
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Account management (dashboard)
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildManagement)
)

// ===== TASK 5 ROUTES =====

// GET: Deliver account update form view
router.get(
  "/update",
  utilities.checkLogin,
  utilities.checkJWTToken,   // Check JWT to get accountData for logged-in user
  utilities.handleErrors(accountController.buildUpdateAccountView) // Make sure this matches your controller function
)

// POST: Process account info update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),    // validation middleware for account info update
  regValidate.checkUpdateData,  // validation result check middleware
  utilities.handleErrors(accountController.updateAccountInfo)
)

// POST: Process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),   // validation middleware for password update
  regValidate.checkPasswordData, // validation result check middleware
  utilities.handleErrors(accountController.updatePassword)
)

// Process logout
router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  req.flash('notice', 'You have been logged out successfully.')
  res.redirect('/') 
})

module.exports = router
