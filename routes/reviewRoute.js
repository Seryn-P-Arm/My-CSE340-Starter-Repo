const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");

router.post(
    "/add",
    utilities.checkLogin, // ensure logged in
    utilities.handleErrors(reviewController.postReview)
);

router.delete(
  "/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
