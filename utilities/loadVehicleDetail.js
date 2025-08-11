// utilities/loadVehicleDetail.js
const inventoryModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");

async function loadVehicleDetail(inv_id) {
  // Fetch vehicle
  const vehicleData = await inventoryModel.getVehicleById(inv_id);
  if (!vehicleData) {
    throw new Error("Vehicle not found");
  }

  // Fetch average rating
  const avgRatingResult = await reviewModel.getVehicleAverageRating(inv_id);
  const average_rating = avgRatingResult.rows[0]?.average_rating || "No ratings yet";

  // Fetch reviews
  const reviewsResult = await reviewModel.getVehicleReviews(inv_id);
  const reviews = reviewsResult.rows;

  return { vehicleData, average_rating, reviews };
}

module.exports = loadVehicleDetail;
