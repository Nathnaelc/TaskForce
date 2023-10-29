/**
 * This module defines the routes for the Todo API and provide for my API.js in react.
 * It exports an Express router instance that can be mounted on a path in the main app.
 * @module routes/todoRoutes
 */

const express = require("express");
const Todo = require("../models/todoModel");
const router = express.Router();

/**
 * Route to get all todos for a user.
 * @name GET /api/:userId/todos
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} userId - The ID of the user to get todos for.
 * @returns {Object[]} An array of todo objects for the given user.
 * @throws {404} If no todos are found for the given user.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to get a single todo by id.
 * @name GET /api/todo/:taskId
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the todo to get.
 * @returns {Object} The todo object with the given ID.
 * @throws {404} If no todo is found with the given ID.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to add a new parent task.
 * @name POST /api/addtodo
 * @function
 * @memberof module:routes/todoRoutes
 * @param {Object} req.body - The todo object to add.
 * @returns {Object} The newly added todo object.
 * @throws {400} If the provided list ID or user ID does not exist.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to update a task.
 * @name PUT /api/:taskId/edit
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} req.body - The updated task object.
 * @returns {Object} The updated task object.
 * @throws {404} If no task is found with the given ID to update.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to delete a task.
 * @name DELETE /api/todo/:taskId
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Object} The deleted task object.
 * @throws {404} If no task is found with the given ID to delete.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to retrieve the subtasks of a given task.
 * @name GET /api/:taskId/subtasks
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the task to get subtasks for.
 * @returns {Object[]} An array of subtask objects for the given task.
 * @throws {404} If no subtasks are found for the given task ID.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to add a subtask to a given task.
 * @name POST /api/:taskId/addSubtask
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the task to add a subtask to.
 * @param {Object} req.body - The subtask object to add.
 * @returns {Object} The newly added subtask object.
 * @throws {400} If the parent task ID is invalid.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to retrieve a task and its entire hierarchy of subtasks recursively.
 * @name GET /api/:taskId/withSubTasks
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the task to get and its subtasks.
 * @returns {Object} The task object with its subtasks recursively.
 * @throws {404} If no task is found with the given ID.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to get all todos for a list.
 * @name GET /api/lists/:listId/todos
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} listId - The ID of the list to get todos for.
 * @returns {Object[]} An array of todo objects for the given list.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to update the 'is_completed' status of a task.
 * @name PUT /api/:taskId/toggleCompletion
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} req.body - The updated task object with the 'isCompleted' property.
 * @returns {Object} The updated task object.
 * @throws {404} If no task is found with the given ID to update.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to delete a subtask with its children recursively.
 * @name DELETE /api/taskWithSubtasks/:taskId
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the subtask to delete.
 * @returns {Object} A success message.
 * @throws {500} If there is a server error.
 */
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

/**
 * Route to move a task to a different list.
 * @name PUT /api/tasks/:taskId/move/:targetListId
 * @function
 * @memberof module:routes/todoRoutes
 * @param {string} taskId - The ID of the task to move.
 * @param {string} targetListId - The ID of the list to move the task to.
 * @returns {string} A success message.
 * @throws {500} If there is a server error.
 */
router.put("/tasks/:taskId/move/:targetListId", async (req, res) => {
  try {
    const { taskId, targetListId } = req.params;
    await Todo.moveTaskToList(taskId, targetListId);
    res.status(200).send("Task moved successfully");
  } catch (error) {
    console.error("Server Error moving todo:", error);
    res.status(500).send("Server error");
  }
});

// export the router
module.exports = router;
