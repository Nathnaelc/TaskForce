const db = require("../db/db");

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

module.exports = {
  getAllListsForUser,
  addNewList,
};
