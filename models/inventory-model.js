const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    const data = await pool.query(
        `SELECT * FROM public.classification 
        ORDER BY classification_name`)
    return data.rows; 
  } catch (error) {
    console.error("getClassifications error: " + error);
    return [];
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

/* *****************************
*   Insert new classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Insert new Inventory
* *************************** */
async function addInventory(
  classification_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail,
  inv_price, inv_miles, inv_color
) {
  try {
    const sql = `INSERT INTO inventory 
    (classification_id, inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`

    const result = await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color
    ])
    
    return result.rows[0] // Return the inserted record
  } catch (error) {
    console.error("SQL INSERT ERROR:", error.message)
    throw error // Let it bubble up!
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory};