// Needed Resources 
const invValidate = require('../utilities/inventory-validation')
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// PUBLIC ROUTES (No auth needed)
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:inv_id", invController.buildDetailPage)

// PROTECTED ROUTES — Employees/Admins only
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

router.get(
  "/management",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)

router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteView)
)

// POST ROUTES
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory) 
)

router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router
