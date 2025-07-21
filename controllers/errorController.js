// controllers/errorController.js
const errorController = {}

errorController.throwError = (req, res, next) => {
  try {
    // Boom! This will crash it.
    throw new Error("Intentional server error for testing purposes")
  } catch (err) {
    next(err) // Pass the error to the middleware
  }
}

module.exports = errorController
