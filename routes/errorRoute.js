// routes/errorRoute.js
const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")

router.get("/trigger", errorController.throwError)

module.exports = router
