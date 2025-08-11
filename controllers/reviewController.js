const reviewModel = require("../models/review-model");

async function postReview(req, res) {
    try {
        const { inv_id, rating, review_text } = req.body;
        const account_id = res.locals.accountData.account_id;
        
        // 🛑 Prevent empty review submissions
        if (!review_text || review_text.trim() === "") {
          req.flash("error", "Please enter a review before submitting.");
          return res.redirect(`/inv/detail/${inv_id}`);
        }

        await reviewModel.addReview(inv_id, account_id, rating, review_text);
        req.flash("notice", "Review submitted successfully!");
        res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { // unique violation
            req.flash("error", "You’ve already reviewed this vehicle. You can edit your existing review.");
        } else {
            req.flash("error", "Could not post review. Try again.");
        }
        res.redirect(`/inv/detail/${req.body.inv_id}`);
    }
}

async function deleteReview(req, res) {
  const reviewId = parseInt(req.params.review_id);
  const accountId = res.locals.accountData.account_id;

  try {
    const result = await reviewModel.deleteReview(reviewId, accountId);
    if (result) {
      req.flash('notice', 'Review deleted successfully.');
    } else {
      req.flash('error', 'Unable to delete review.');
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred while deleting the review.');
  }

  res.redirect(`/inv/detail/${req.body.inv_id || req.params.inv_id}`);
}

module.exports = { postReview, deleteReview };
