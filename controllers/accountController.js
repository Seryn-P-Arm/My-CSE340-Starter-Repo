/* ******************************************
 *  Account Controller
 * *************************************** */
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt")
const utilities = require('../utilities')
const accountModel = require('../models/account-model')

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    return res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver Account Management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log('Login attempt for:', account_email);
  console.log('Account found:', accountData ? true : false);

  if (accountData) {
    console.log('Stored hashed password:', accountData.account_password);
    console.log('Password from form:', account_password);
  }
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
* Deliver Account Update View
* *************************************** */
async function buildUpdateAccountView(req, res, next) {
  let nav = await utilities.getNav();
  try {
    const account_id = res.locals.accountData.account_id; // from JWT token
    const accountData = await accountModel.getAccountById(account_id);
    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
* Process Account Info Update
* *************************************** */
async function updateAccountInfo(req, res, next) {
  let nav = await utilities.getNav();
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    const updateResult = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      req.flash("notice", "Account information successfully updated.");
      // Get updated info for display
      const updatedAccount = await accountModel.getAccountById(account_id);
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: updatedAccount,
      });
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "Failed to update account information.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body,
    });
  }
}

/* ****************************************
* Process Password Update
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  try {
    const { account_id, account_password } = req.body;

    // Hash new password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password successfully updated.");
      const updatedAccount = await accountModel.getAccountById(account_id);
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: updatedAccount,
      });
    } else {
      throw new Error("Password update failed");
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "Failed to update password.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdateAccountView, updateAccountInfo, updatePassword }