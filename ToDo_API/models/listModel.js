const db = require("../db/db");

/**
 * Retrieves all lists for a given user from the database.
 * @async
 * @function
 * @param {number} userId - The ID of the user to retrieve lists for.
 * @returns {Promise<Array>} - A promise that resolves to an array of list objects.
 * @throws {Error} - Throws an error if the database query fails.
 */
const getAllListsForUser = async (userId) => {
  try {
    const query = `SELECT * FROM lists WHERE user_id = $1`;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch lists: ${error.message}`);
  }
};

/**
 * Adds a new list to the database.
 * @async
 * @function addNewList
 * @param {Object} listData - The data for the new list.
 * @param {number} listData.user_id - The ID of the user who owns the list.
 * @param {string} listData.list_name - The name of the new list.
 * @returns {Object} The newly created list.
 * @throws {Object} If there was an error adding the list.
 */
const addNewList = async (listData) => {
  try {
    const query = `INSERT INTO lists (user_id, list_name) VALUES ($1, $2) RETURNING *`;
    const values = [listData.user_id, listData.list_name];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error while adding new list:", error);
    throw { message: `Failed to add list: ${error.message}` };
  }
};

// export the functions
module.exports = {
  getAllListsForUser,
  addNewList,
};
