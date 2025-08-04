// Needed Resources 
const invValidate = require('../utilities/inventory-validation')
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

// Deliver management view
router.get("/management", utilities.handleErrors(invController.buildManagement))

// Deliver add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Deliver inventory management get inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Process the registration data
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Process the inventory registration data
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Process the inventory update
router.post(
  "/update",
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory) 
)

module.exports = router;