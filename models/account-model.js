const bcrypt = require('bcrypt')
const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    // Hash the password before saving it to DB
    const hashedPassword = await bcrypt.hash(account_password, 10) // 10 salt rounds

    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
    return result
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type
      FROM account
      WHERE account_id = $1
    `
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    throw new Error("Error fetching account by ID: " + error.message)
  }
}
// Update account info
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *
    `
    const values = [account_firstname, account_lastname, account_email, account_id]
    const result = await pool.query(sql, values)
    return result.rowCount > 0
  } catch (error) {
    throw new Error("Error updating account info: " + error.message)
  }
}

// Update password
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
    `
    const values = [hashedPassword, account_id]
    const result = await pool.query(sql, values)
    return result.rowCount > 0
  } catch (error) {
    throw new Error("Error updating password: " + error.message)
  }
}

module.exports = { registerAccount, getAccountByEmail, getAccountById, updateAccountInfo, updatePassword };