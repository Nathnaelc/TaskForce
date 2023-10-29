const express = require("express");
const List = require("../models/listModel");
const router = express.Router();

/**
 * Endpoint for getting all lists for a user
 * @param {string} userId - The ID of the user whose lists are being retrieved
 * @returns {object} - A JSON object containing an array of lists
 */
router.get("/:userId/getlists", async (req, res) => {
  try {
    const lists = await List.getAllListsForUser(req.params.userId);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

/**
 * Endpoint for creating a new list
 * @param {string} user_id - The ID of the user creating the lists
 * @param {string} list_name - The name of the new list
 * @returns {object} - A JSON object containing the newly created list
 */
router.post("/addlist", async (req, res) => {
  try {
    if (!req.body.user_id || !req.body.list_name) {
      // If required fields are missing, return an error message
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const newList = await List.addNewList(req.body);
    res.json(newList);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

module.exports = router;
