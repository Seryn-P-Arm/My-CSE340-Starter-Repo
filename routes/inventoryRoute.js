// Needed Resources 
const classValidate = require('../utilities/inventory-validation')
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build detail view for a specific inventory item
router.get("/detail/:inv_id", invController.buildDetailPage);

// Deliver add classifications view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process the registration data
router.post(
  "/add-classification",
  classValidate.addClassificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

module.exports = router;