// api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

// fetch all lists for a user
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

// add a new list on the sidebar
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

// recursive function to get todo and subtasks
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

// add a new parent todo task
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

// add a new subtask to a parent task
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

export {
  fetchTodoLists,
  addNewList,
  getAllTodosForList,
  getTodoAndSubTasks,
  addTodo,
  addSubtaskAPI,
  getTodoWithSubtasks,
};
