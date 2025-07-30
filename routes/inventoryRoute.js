// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation"); // example validation file
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build detail view for a specific inventory item
router.get("/detail/:inv_id", invController.buildDetailPage);

router.get("/add-classification", 
  utilities.handleErrors(invController.buildAddClassificationView));

router.post("/add-classification", 
  invValidation.classificationRules(),
  invValidation.checkClassificationData,
  utilities.handleErrors(invController.insertClassification)
);

module.exports = router;