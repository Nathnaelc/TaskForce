// This module exports functions to interact with the 'tasks' table in the database.

const db = require("../db/db");
const { pool } = require("../db/db");

/**
 * Retrieve all todos for a user with a given list ID.
 * @param {number} listId - The ID of the list to retrieve todos for.
 * @returns {Promise<Array>} - A promise that resolves to an array of todos for the given list ID.
 * @throws {Error} - If there is an error retrieving the todos from the database.
 */
const getAllTodosForList = async (listId) => {
  try {
    const query = "SELECT * FROM tasks WHERE list_id = $1";
    const values = [listId];
    const result = await db.query(query, values);
    return result.rows.length ? result.rows : [];
  } catch (error) {
    console.error("Database Error:", error.message); // Log errors only to console
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Recursive function to get todo and subtasks.
 * @param {number} taskId - The ID of the task to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the task and its subtasks.
 * @throws {Error} - If there is an error retrieving the task from the database.
 */
const getTodoAndSubTasks = async (taskId) => {
  if (!taskId) {
    throw new Error("Invalid Task ID provided.");
  }

  try {
    const todo = await getTodoById(taskId);

    if (!todo) {
      throw new Error("Task with the given ID does not exist.");
    }

    const subTasks = await getSubTasks(taskId);
    if (subTasks && subTasks.length > 0) {
      todo.subTasks = await Promise.all(
        subTasks.map(async (subTask) => {
          if (!subTask.task_id) {
            console.error("Invalid subTask:", subTask);
            return null; // or some other default behavior
          }
          return getTodoAndSubTasks(subTask.task_id);
        })
      );
    }

    return todo;
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Get a todo by its ID.
 * @param {number} taskId - The ID of the task to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the task.
 * @throws {Error} - If there is an error retrieving the task from the database.
 */
const getTodoById = async (taskId) => {
  try {
    const query = "SELECT * FROM tasks WHERE task_id = $1";
    const values = [taskId];
    const result = await db.query(query, values);

    if (!result.rows.length) {
      throw new Error("Task with the given ID does not exist.");
    }

    return result.rows[0];
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Add a todo to the 'tasks' table.
 * @param {Object} todoData - An object containing the data for the new todo.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the newly added todo.
 * @throws {Error} - If there is an error adding the todo to the database.
 */
const addTodo = async (todoData) => {
  try {
    const query = `INSERT INTO tasks (list_id, parent_task_id, user_id, task_name) VALUES ($1, $2, $3, $4) RETURNING *`;

    // If parent_task_id is null, let it remain null, else convert to integer.
    const parentTaskId = todoData.parent_task_id
      ? parseInt(todoData.parent_task_id)
      : null;

    const values = [
      todoData.list_id,
      parentTaskId,
      todoData.user_id,
      todoData.task_name,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (dbError) {
    throw new Error(`Database Error: ${dbError.message}`);
  }
};

/**
 * Update a todo in the 'tasks' table.
 * @param {number} taskId - The ID of the task to update.
 * @param {Object} updateData - An object containing the data to update the todo with.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the updated todo.
 * @throws {Error} - If there is an error updating the todo in the database.
 */
const updateTodo = async (taskId, updateData) => {
  try {
    const query = `UPDATE tasks SET task_name = $1, is_completed = $2 WHERE task_id = $3 RETURNING *`;
    const values = [updateData.task_name, updateData.is_completed, taskId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("No task found with the given ID to update.");
    }

    return result.rows[0];
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Delete a todo from the 'tasks' table.
 * @param {number} taskId - The ID of the task to delete.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the deleted todo.
 * @throws {Error} - If there is an error deleting the todo from the database.
 */
const deleteTodo = async (taskId) => {
  try {
    const query = "DELETE FROM tasks WHERE task_id = $1 RETURNING *";
    const values = [taskId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("No task found with the given ID to delete.");
    }

    return result.rows[0];
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Get all subtasks for a given task ID.
 * @param {number} taskId - The ID of the task to retrieve subtasks for.
 * @returns {Promise<Array>} - A promise that resolves to an array of subtasks for the given task ID.
 * @throws {Error} - If there is an error retrieving the subtasks from the database.
 */
const getSubTasks = async (taskId) => {
  try {
    const query = "SELECT * FROM tasks WHERE parent_task_id = $1";
    const values = [taskId];
    const result = await db.query(query, values);

    return result.rows; // returning an empty array if no subtasks are found is fine
  } catch (error) {
    console.error("Server-side error:", error.message);
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Add a subtask to the 'tasks' table.
 * @param {Object} subtaskData - An object containing the data for the new subtask.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the newly added subtask.
 * @throws {Error} - If there is an error adding the subtask to the database.
 */
const addSubtask = async (subtaskData) => {
  try {
    const query =
      "INSERT INTO tasks (task_name, parent_task_id, list_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [
      subtaskData.task_name,
      subtaskData.parent_task_id,
      subtaskData.list_id,
      subtaskData.user_id,
    ];

    const result = await db.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Server-side error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

/**
 * Update the 'is_completed' status of a task for parent tasks.
 * @param {number} taskId - The ID of the task to update.
 * @param {boolean} isCompleted - The new value for the 'is_completed' field.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the updated task.
 * @throws {Error} - If there is an error updating the task in the database.
 */
const toggleParentTaskCompletion = async (taskId, isCompleted) => {
  try {
    const query = `UPDATE tasks SET is_completed = $1 WHERE task_id = $2 RETURNING *`;
    const values = [isCompleted, taskId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("No task found with the given ID to update.");
    }

    return result.rows[0];
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Recursively delete subtasks for a given task ID.
 * @param {number} taskId - The ID of the task to delete subtasks for.
 * @throws {Error} - If there is an error deleting the subtasks from the database.
 */
const deleteSubTasks = async (taskId) => {
  try {
    const subTasks = await getSubTasks(taskId);
    for (let subTask of subTasks) {
      await deleteSubTasks(subTask.task_id);
    }
    await deleteTodo(taskId);
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
};

/**
 * Recursive function to update 'list_id' for subtasks.
 * @param {Object} client - The database client to use for the transaction.
 * @param {number} parentTaskId - The ID of the parent task to update subtasks for.
 * @param {number} targetListId - The ID of the list to move the subtasks to.
 * @throws {Error} - If there is an error updating the subtasks in the database.
 */
const updateSubTasksListId = async (client, parentTaskId, targetListId) => {
  const subTasks = await getSubTasks(parentTaskId);
  for (const subTask of subTasks) {
    await client.query("UPDATE tasks SET list_id = $1 WHERE task_id = $2", [
      targetListId,
      subTask.task_id,
    ]);
    await updateSubTasksListId(client, subTask.task_id, targetListId);
  }
};

/**
 * Move a task to a new list.
 * @param {number} taskId - The ID of the task to move.
 * @param {number} targetListId - The ID of the list to move the task to.
 * @throws {Error} - If there is an error moving the task in the database.
 */
const moveTaskToList = async (taskId, targetListId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update the task
    await client.query("UPDATE tasks SET list_id = $1 WHERE task_id = $2", [
      targetListId,
      taskId,
    ]);

    // Update all subtasks recursively
    await updateSubTasksListId(client, taskId, targetListId);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Export the functions
module.exports = {
  getAllTodosForList,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  getSubTasks,
  getTodoAndSubTasks,
  addSubtask,
  toggleParentTaskCompletion,
  deleteSubTasks,
  moveTaskToList,
};
