const express = require("express");
const Todo = require("../models/todoModel");
const router = express.Router();

// Get all todos for a user
router.get("/:userId/todos", async (req, res) => {
  try {
    const todos = await Todo.getAllTodosForUser(req.params.userId);
    if (!todos.length) {
      return res.status(404).send("No todos found for this user.");
    }
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Get a single todo by id
router.get("/todo/:taskId", async (req, res) => {
  try {
    const todo = await Todo.getTodoById(req.params.taskId);
    if (!todo) {
      return res.status(404).send("Task with the given ID not found.");
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Add a new parent task
router.post("/addtodo", async (req, res) => {
  try {
    const newTodo = await Todo.addTodo(req.body);
    res.json(newTodo);
  } catch (error) {
    // Check for specific error type for better messages
    if (
      error.message.includes(
        'violates foreign key constraint "tasks_list_id_fkey"'
      )
    ) {
      res.status(400).send("Error: The provided list ID does not exist.");
    } else if (
      error.message.includes(
        'violates foreign key constraint "tasks_user_id_fkey"'
      )
    ) {
      res.status(400).send("Error: The provided user ID does not exist.");
    } else {
      res.status(500).send(`Server Error: ${error.message}`);
    }
  }
});

router.put("/todo/:taskId", async (req, res) => {
  try {
    const updatedTodo = await Todo.updateTodo(req.params.taskId, req.body);

    if (!updatedTodo) {
      return res.status(404).send("No task found with the given ID to update.");
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Delete a task
router.delete("/todo/:taskId", async (req, res) => {
  try {
    const deletedTodo = await Todo.deleteTodo(req.params.taskId);

    if (!deletedTodo) {
      return res.status(404).send("No task found with the given ID to delete.");
    }

    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// simply retrieves the subtasks of a given task
router.get("/todo/:taskId/subtasks", async (req, res) => {
  try {
    const subTasks = await Todo.getSubTasks(req.params.taskId);

    if (!subTasks || subTasks.length === 0) {
      return res.status(404).send("No subtasks found for the given task ID.");
    }

    res.json(subTasks);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// adds a subtask to a given task
router.post("/todo/:taskId/addSubtask", async (req, res) => {
  try {
    const parentTaskId = req.params.taskId;
    const subtaskData = req.body;
    subtaskData.parent_task_id = parentTaskId;

    const newSubtask = await Todo.addSubtask(subtaskData);

    res.status(201).json(newSubtask);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// retrieves a task and its entire hierarchy of subtasks recursively
router.get("/todo/:taskId/withSubTasks", async (req, res) => {
  try {
    console.log("Task ID:", req.params.taskId);
    if (!req.params.taskId) {
      return res.status(400).send("Task ID not provided.");
    }

    const todoWithSubTasks = await Todo.getTodoAndSubTasks(req.params.taskId);

    if (!todoWithSubTasks) {
      return res.status(404).send("Task with the given ID not found.");
    }

    res.json(todoWithSubTasks);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Get all todos for a list
router.get("/lists/:listId/todos", async (req, res) => {
  try {
    // console.log("here in todoRoutes");
    const todos = await Todo.getAllTodosForList(req.params.listId);
    if (!todos.length) {
      return res.status(404).send("No todos found for this list.");
    }
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error); // log detailed error
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = router;
