const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildDetailPage = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getVehicleById(inv_id)
  let nav = await utilities.getNav()

  if (!data || data.length === 0) {
    return res.status(404).send("Vehicle not found.")
  }

  const vehicle = data[0] // Get full vehicle data
  const grid = await utilities.buildVehicleDetailHTML([vehicle]) // wrap in array

  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    grid,
    vehicle,
  })
}

/* ****************************************
*  Deliver add classification form view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Newly Added Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addClassResult = await classificationModel.addClassification(
    classification_name
  )

  if (addClassResult) {
    req.flash(
      "notice",
      `${classification_name} successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Add Classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, failed to add new classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

module.exports = invCont