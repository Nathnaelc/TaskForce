import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

/**
 * Fetches all todo lists for a user.
 * @returns {Promise<Array>} An array of todo lists.
 * @throws {Error} If there was an error fetching the todo lists.
 */
const fetchTodoLists = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(
      `${BASE_URL}/api/lists/${userId}/getlists`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Adds a new list to the TodoList Sidebar.
 * @param {string} userId The ID of the user adding the list.
 * @param {string} listName The name of the new list.
 * @returns {Promise<Object>} The new list object.
 * @throws {Error} If there was an error adding the new list.
 */
const addNewList = async (userId, listName) => {
  try {
    const response = await fetch(`${BASE_URL}/api/lists/addlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        list_name: listName,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to add new list:", error);
  }
};

/**
 * Fetches all todos for a given list.
 * @param {string} listId The ID of the list to fetch todos for.
 * @returns {Promise<Array>} An array of todos for the given list.
 * @throws {Error} If there was an error fetching the todos.
 */
const getAllTodosForList = async (listId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/todos/lists/${listId}/todos`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Network error fetching todos for list ${listId}: ${error.message}`
    );
    return [];
  }
};

/**
 * Recursively fetches a todo and its subtasks.
 * @param {string} taskId The ID of the todo to fetch.
 * @returns {Promise<Object>} The todo object with its subtasks.
 * @throws {Error} If there was an error fetching the todo and subtasks.
 */
const getTodoAndSubTasks = async (taskId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/todos/${taskId}/withSubTasks`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Network error fetching todo and subtasks for task ${taskId}: ${error.message}`
    );
    return null;
  }
};

/**
 * Adds a new parent todo task.
 * @param {Object} todo The todo object to add.
 * @returns {Promise<Object>} The new todo object.
 * @throws {Error} If there was an error adding the new todo.
 */
const addTodo = async (todo) => {
  const response = await fetch(`${BASE_URL}/api/todos/addtodo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
};

/**
 * Adds a new subtask to a parent task.
 * @param {string} parentId The ID of the parent task.
 * @param {Object} subtaskData The subtask object to add.
 * @returns {Promise<Object>} The new subtask object.
 * @throws {Error} If there was an error adding the new subtask.
 */
const addSubtaskAPI = async (parentId, subtaskData) => {
  try {
    console.log("Parent ID in API function::", parentId);
    console.log("Subtask Data in API function:", subtaskData);
    console.log("Type of Parent ID in API function:", typeof parentId);

    const response = await fetch(
      `${BASE_URL}/api/todos/${parentId}/addSubtask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subtaskData),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Could not add subtask.");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a todo with its subtasks.
 * @param {string} taskId The ID of the todo to fetch.
 * @returns {Promise<Object>} The todo object with its subtasks.
 * @throws {Error} If there was an error fetching the todo and subtasks.
 */
const getTodoWithSubtasks = async (taskId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/todos/${taskId}/withSubTasks`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Could not fetch todo with subtasks.");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggles the completion status of a parent task.
 * @param {string} taskId The ID of the parent task.
 * @param {boolean} isCompleted The new completion status.
 * @returns {Promise<Object>} The updated todo object.
 * @throws {Error} If there was an error toggling the completion status.
 */
const toggleTaskCompletion = async (taskId, isCompleted) => {
  const response = await fetch(
    `${BASE_URL}/api/todos/${taskId}/toggleCompletion`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted }),
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    const message = await response.text();
    throw new Error(message);
  }
};

/**
 * Deletes a subtask with its subtasks.
 * @param {string} taskId The ID of the subtask to delete.
 * @returns {Promise<Object>} The deleted subtask object.
 * @throws {Error} If there was an error deleting the subtask and subtasks.
 */
const deleteTaskWithSubTasks = async (taskId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/todos/taskWithSubtasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting task with subtasks: ${error}`);
  }
};

/**
 * Moves a task to a different list.
 * @param {string} taskId The ID of the task to move.
 * @param {string} targetListId The ID of the target list.
 * @returns {Promise<Object>} The updated todo object.
 * @throws {Error} If there was an error moving the task.
 */
const moveTaskToList = async (taskId, targetListId) => {
  try {
    console.log("Task ID for move:", taskId);
    console.log("Target List ID for move:", targetListId);
    const response = await fetch(
      `${BASE_URL}/api/todos/tasks/${taskId}/move/${targetListId}`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      console.error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error moving task: ${error}`);
  }
};

export {
  fetchTodoLists,
  addNewList,
  getAllTodosForList,
  getTodoAndSubTasks,
  addTodo,
  addSubtaskAPI,
  getTodoWithSubtasks,
  toggleTaskCompletion,
  deleteTaskWithSubTasks,
  moveTaskToList,
};
