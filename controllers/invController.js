const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId)

  if (isNaN(classification_id)) {
    return res.status(400).send("Invalid classification ID.")
  }

  const data = await invModel.getInventoryByClassificationId(classification_id)

  if (!data || data.length === 0) {
    return res.status(404).send("No vehicles found for this classification.")
  }

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
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getVehicleById(inv_id)
    if (!data || data.length === 0) {
      return res.status(404).send("Vehicle not found.")
    }
    let nav = await utilities.getNav()
    const vehicle = data[0]
    const grid = await utilities.buildVehicleDetailHTML([vehicle])
    const reviewResult = await reviewModel.getVehicleReviews(inv_id)
    const reviews = reviewResult.rows
    const avgResult = await reviewModel.getVehicleAverageRating(inv_id)
    const average_rating = avgResult.rows[0].average_rating || 'No ratings yet'

    res.render("./inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      grid,
      vehicle,
      average_rating,
      reviews,
      accountData: res.locals.accountData,
      errors: req.errors || null,
    })
  } catch (error) {
    console.error("Error in buildDetailPage:", error)
    next(error)
  }
}

/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Management",
    nav,
    classificationList,
    errors: null,
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
  const { classification_name } = req.body;

  try {
    const addClassResult = await invModel.addClassification(classification_name);

    if (addClassResult) {
      req.flash("notice", `${classification_name} successfully added.`);
      return res.redirect("/inv/management"); // ✅ correct usage
    } else {
      req.flash("notice", "Sorry, failed to add new classification.");
      return res.redirect("/inv/add-classification");
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "An error occurred while adding the classification.");
    return res.redirect("/inv/add-classification");
  }
};

/* ****************************************
*  Deliver add inventory form view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
    })
  } catch (error) {
    console.error('🚨 Error in buildAddInventory:', error)
    next(error)
  }
}

/* ****************************************
*  Process Newly Added Inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;

  try {
    const addInvResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color);

    if (addInvResult) {
      req.flash("notice", `${inv_year} ${inv_make} ${inv_model} successfully added.`);
      return res.redirect("/inv/management"); // ✅ correct usage
    } else {
      req.flash("notice", "Sorry, failed to add new inventory.");
      return res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    req.flash("notice", "An error occurred while adding the inventory.");
    return res.redirect("/inv/add-inventory");
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const item = itemData[0]
  const classificationSelect = await utilities.buildClassificationList(item.classification_id)
  const itemName = `${item.inv_make} ${item.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id: item.inv_id,
    inv_make: item.inv_make,
    inv_model: item.inv_model,
    inv_year: item.inv_year,
    inv_description: item.inv_description,
    inv_image: item.inv_image,
    inv_thumbnail: item.inv_thumbnail,
    inv_price: item.inv_price,
    inv_miles: item.inv_miles,
    inv_color: item.inv_color,
    classification_id: item.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const item = itemData[0]
  const itemName = `${item.inv_make} ${item.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: item.inv_id,
    inv_make: item.inv_make,
    inv_model: item.inv_model,
    inv_year: item.inv_year,
    inv_price: item.inv_price,
    classification_id: item.classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id } = req.body

  const vehicleData = await invModel.getVehicleById(inv_id)
  const vehicle = vehicleData[0]
  
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  
  if (deleteResult && deleteResult.rowCount > 0) {
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("./inventory/delete-confirm", {
    title: "Delete Vehicle",
    nav,
    inv_id,
    errors: null,
    })
  }
}

module.exports = invCont