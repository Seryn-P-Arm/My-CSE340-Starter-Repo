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

invCont.buildAddClassificationView = async function (req, res) {
  res.render("inventory/add-classification", {
    title: "Add Classification",
    messages: req.flash("info"),
    errors: null
  });
};

invCont.insertClassification = async function (req, res) {
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("info", "New classification successfully added!");

    // Refresh navigation
    const nav = await utilities.getNav(); // assuming your nav is built this way
    res.locals.nav = nav;

    res.redirect("/inv");
  } else {
    req.flash("error", "Failed to add classification. Try again.");
    res.render("inventory/add-classification", {
      title: "Add Classification",
      messages: req.flash("error"),
      errors: null
    });
  }
};

module.exports = invCont