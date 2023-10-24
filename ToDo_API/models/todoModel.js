const db = require("../db/db");

// This function should retrieve all todos for a user with a given list ID
const getAllTodosForList = async (listId) => {
  try {
    const query = "SELECT * FROM tasks WHERE list_id = $1"; // Updated column name to list_id
    const values = [listId];
    const result = await db.query(query, values);

    if (!result.rows.length) {
      throw new Error("No todos found for this list.");
    }

    return result.rows;
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
};

// recursive function to get todo and subtasks
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

// get todos by id
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

// add todo into tasks table
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

// update todo by id
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

// delete todo by id
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

// get subtasks
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

// add subtask
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

    // if (result.rows.length === 0) {
    //   throw new Error("Failed to insert the subtask.");
    // }

    return result.rows[0];
  } catch (error) {
    console.error("Server-side error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

// export the functions
module.exports = {
  getAllTodosForList,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  getSubTasks,
  getTodoAndSubTasks,
  addSubtask,
};
