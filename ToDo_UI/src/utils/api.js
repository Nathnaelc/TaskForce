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

// add a new list on the TodoList Sidebar
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

// toggle Parent task completion
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

// delete a subtask with subtasks
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

// move a task to a different list
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
