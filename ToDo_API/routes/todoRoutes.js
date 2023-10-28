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

router.put("/:taskId/edit", async (req, res) => {
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
router.get("/:taskId/subtasks", async (req, res) => {
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
router.post("/:taskId/addSubtask", async (req, res) => {
  try {
    const parentTaskId = req.params.taskId;
    const parentTask = await Todo.getTodoById(parentTaskId);

    if (!parentTask) {
      return res.status(400).json({ error: "Invalid parent_task_id" });
    }

    const subtaskData = req.body;
    subtaskData.parent_task_id = parentTaskId;

    const newSubtask = await Todo.addSubtask(subtaskData);

    res.status(201).json(newSubtask);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// retrieves a task and its entire hierarchy of subtasks recursively
router.get("/:taskId/withSubTasks", async (req, res) => {
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
    console.error("Server Error:", error); // Add this line
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Get all todos for a list
router.get("/lists/:listId/todos", async (req, res) => {
  try {
    const todos = await Todo.getAllTodosForList(req.params.listId);
    if (!todos.length) {
      return res.status(200).json([]);
    }
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Update the 'is_completed' status of a task
router.put("/:taskId/toggleCompletion", async (req, res) => {
  try {
    const updatedTodo = await Todo.toggleParentTaskCompletion(
      req.params.taskId,
      req.body.isCompleted
    );

    if (!updatedTodo) {
      return res.status(404).send("No task found with the given ID to update.");
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Delete a subtask with its children recursively
router.delete("/taskWithSubtasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    await Todo.deleteSubTasks(taskId);
    res
      .status(200)
      .json({ message: "Task and subtasks deleted successfully." });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Move a task to a different list
router.put("/tasks/:taskId/move/:targetListId", async (req, res) => {
  try {
    const { taskId, targetListId } = req.params;
    await Todo.moveTaskToList(taskId, targetListId);
    res.status(200).send("Task moved successfully");
  } catch (e) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
