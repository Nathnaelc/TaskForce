const express = require("express");
const List = require("../models/listModel");
const router = express.Router();

// Get all lists for a user
router.get("/:userId/getlists", async (req, res) => {
  try {
    const lists = await List.getAllListsForUser(req.params.userId);
    res.json(lists);
  } catch (error) {
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

// Create a new list
router.post("/addlist", async (req, res) => {
  try {
    if (!req.body.user_id || !req.body.list_name) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const newList = await List.addNewList(req.body);
    res.json(newList);
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

module.exports = router;
