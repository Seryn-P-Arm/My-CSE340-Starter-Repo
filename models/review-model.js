const pool = require("../database");

async function addReview(inv_id, account_id, rating, review_text) {
    const sql = `INSERT INTO vehicle_reviews (inv_id, account_id, rating, review_text)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`;
    return pool.query(sql, [inv_id, account_id, rating, review_text]);
}

async function getVehicleReviews(inv_id) {
    const sql = `SELECT vr.*, a.account_firstname, a.account_lastname
                 FROM vehicle_reviews vr
                 JOIN account a ON vr.account_id = a.account_id
                 WHERE inv_id = $1
                 ORDER BY created_at DESC`;
    return pool.query(sql, [inv_id]);
}

async function getVehicleAverageRating(inv_id) {
    const sql = `SELECT ROUND(AVG(rating),1) AS average_rating
                 FROM vehicle_reviews
                 WHERE inv_id = $1`;
    return pool.query(sql, [inv_id]);
}

async function deleteReview(review_id, account_id) {
  const sql = `
    DELETE FROM vehicle_reviews
    WHERE review_id = $1 AND account_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [review_id, account_id]);
  return result.rowCount > 0;
}

module.exports = { addReview, getVehicleReviews, getVehicleAverageRating, deleteReview };
