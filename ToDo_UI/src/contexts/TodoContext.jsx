import React, { createContext, useState, useEffect, useContext } from "react";
import {
  fetchTodoLists,
  addNewList,
  getAllTodosForList,
  getTodoWithSubtasks,
  addTodo,
  addSubtaskAPI,
  toggleTaskCompletion,
  deleteTaskWithSubTasks,
  moveTaskToList,
} from "./../utils/api";

const TodoContext = createContext();

/**
 * A provider component that wraps the entire app and provides access to the todo list data and functions.
 * @param {ReactNode} children - The child components to be wrapped by the provider.
 * @returns {ReactElement} - The todo list provider component.
 */
export const TodoProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noListsAvailable, setNoListsAvailable] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  /**
   * A function to organize the tasks and subtasks into a tree structure.
   * @param {Array} flatList - The flat list of tasks and subtasks.
   * @returns {Array} - The organized list of tasks and subtasks.
   */
  const organizeTasksAndSubtasks = (flatList) => {
    const taskMap = {};
    const rootTasks = [];

    // First, create a map of all tasks
    flatList.forEach((task) => {
      task.subTasks = [];
      taskMap[task.task_id] = task;
    });

    // Then, populate subTasks and find root tasks
    flatList.forEach((task) => {
      if (task.parent_task_id) {
        const parentTask = taskMap[task.parent_task_id];
        if (parentTask) {
          // Check if the parent task actually exists
          parentTask.subTasks.push(task);
        } else {
          console.error(
            `Parent task ${task.parent_task_id} not found for task ${task.task_id}`
          );
        }
      } else {
        rootTasks.push(task);
      }
    });

    return rootTasks;
  };

  // for loading the lists
  useEffect(() => {
    async function loadLists() {
      try {
        const data = await fetchTodoLists();

        if (data && data.length > 0) {
          setLists(data);
          setSelectedList(data[0]);
        } else {
          setNoListsAvailable(true); // No lists available
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLists();
  }, []);

  /**
   * A function to refresh the tasks for the selected list.
   * @param {number} listId - The ID of the selected list.
   */
  const refreshTasks = async (listId) => {
    try {
      setLoading(true);
      const updatedTasks = await getAllTodosForList(listId);
      setTodos(updatedTasks);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // for loading the lists
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const allLists = await fetchTodoLists();
        setLists(allLists);
        if (allLists.length > 0) {
          setSelectedList(allLists[0]);
          const initialTodos = await getAllTodosForList(allLists[0].list_id);
          setTodos(initialTodos);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // for loading the todos
  useEffect(() => {
    if (selectedList) {
      async function loadTodos() {
        try {
          setLoading(true);
          const data = await getAllTodosForList(selectedList.list_id);
          const organizedData = organizeTasksAndSubtasks(data);
          // console.log("Initial todos:", data);
          setTodos(organizedData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      loadTodos();
    }
  }, [selectedList]);

  /**
   * A function to select a task and render its subtasks on the sidebar.
   * @param {number} taskId - The ID of the selected task.
   */
  const selectTask = (taskId) => {
    const task = todos.find((todo) => todo.task_id === taskId);
    if (task) {
      setSelectedTask(task);
    } else {
      console.error("Task with ID", taskId, "not found!");
    }
  };

  /**
   * A function to deselect the currently selected task.
   */
  const deselectTask = () => {
    setSelectedTask(null);
  };

  /**
   * A function to add a parent task to the selected list.
   * @param {Object} newTask - The new task object to be added.
   */
  const addTask = async (newTask) => {
    try {
      setLoading(true);
      const addedTask = await addTodo(newTask);
      setTodos((prev) => [...prev, addedTask]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * A function to add a subtask to a given task.
   * @param {number} listId - The ID of the selected list.
   * @param {number} parentId - The ID of the parent task.
   * @param {string} taskName - The name of the new subtask.
   */
  const addSubtask = async (listId, parentId, taskName) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const newSubtask = {
        list_id: listId,
        parent_task_id: parentId,
        user_id: userId,
        task_name: taskName,
      };
      const addedSubtask = await addSubtaskAPI(parentId, newSubtask);

      const addSubtaskToParent = (task, parentId) => {
        if (!task.subTasks) {
          task.subTasks = [];
        }
        if (task.task_id === parentId) {
          task.subTasks.push(addedSubtask);
          return;
        }
        for (const subtask of task.subTasks) {
          addSubtaskToParent(subtask, parentId);
        }
      };

      setTodos((prevTodos) => {
        const deepClone = JSON.parse(JSON.stringify(prevTodos));
        for (const todo of deepClone) {
          addSubtaskToParent(todo, parentId);
        }
        return deepClone;
      });

      setSelectedTask((prevSelectedTask) => {
        const deepClone = JSON.parse(JSON.stringify(prevSelectedTask));
        addSubtaskToParent(deepClone, parentId);
        return deepClone;
      });

      await refreshTasks(listId);
    } catch (error) {
      console.error("Error in addSubtask:", error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * A function to add a new list to the sidebar.
   * @param {string} listName - The name of the new list.
   */
  const addList = async (listName) => {
    try {
      const userId = localStorage.getItem("userId");
      const newList = await addNewList(userId, listName);
      setLists((prevLists) => [...prevLists, newList]);
    } catch (error) {
      console.error("Error adding new list:", error);
    }
  };

  /**
   * A function to toggle the completion of a task.
   * @param {number} taskId - The ID of the task to be toggled.
   * @param {boolean} isCompleted - The new completion status of the task.
   */
  const handleToggleCompletion = async (taskId, isCompleted) => {
    try {
      const updatedTask = await toggleTaskCompletion(taskId, isCompleted);

      // Update todos list
      const updatedTodos = todos.map((todo) =>
        todo.task_id === taskId ? updatedTask : todo
      );

      setTodos(updatedTodos);
    } catch (error) {
      console.error("Could not toggle task completion:", error);
    }
  };

  /**
   * A function to delete a task and its subtasks.
   * @param {number} taskId - The ID of the task to be deleted.
   */
  const deleteTaskAndSubtasks = async (taskId) => {
    try {
      await deleteTaskWithSubTasks(taskId); // Assume this function deletes the task and its subtasks from the database

      const removeTasksFromList = (taskList, targetTaskId) => {
        return taskList.filter((task) => {
          if (task.task_id === targetTaskId) {
            return false; // Remove the task itself
          }
          if (task.subTasks && task.subTasks.length > 0) {
            task.subTasks = removeTasksFromList(task.subTasks, targetTaskId); // Recursively remove from subtasks
          }
          return true; // Keep the task if it's not the target
        });
      };

      const newTasks = removeTasksFromList(todos, taskId);

      setTodos(newTasks); // Update the todos state
    } catch (error) {
      console.error("Error deleting task and subtasks:", error);
    }
  };

  /**
   * A function to move a task to another list.
   * @param {number} taskId - The ID of the task to be moved.
   * @param {number} targetListId - The ID of the target list.
   */
  const moveTask = async (taskId, targetListId) => {
    try {
      setLoading(true);
      await moveTaskToList(taskId, targetListId);
      // Refresh tasks for both the source and target list
      if (selectedList.list_id === targetListId) {
        await refreshTasks(targetListId);
      } else {
        await refreshTasks(selectedList.list_id);
        await refreshTasks(targetListId);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        lists,
        todos,
        setTodos,
        selectedList,
        setSelectedList,
        loading,
        error,
        addTask,
        addList,
        noListsAvailable,
        selectedTask,
        setSelectedTask,
        addSubtask,
        selectTask,
        deselectTask,
        refreshTasks,
        organizeTasksAndSubtasks,
        handleToggleCompletion,
        deleteTaskAndSubtasks,
        moveTask,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

/**
 * A custom hook that provides access to the todo list context.
 * @returns {Object} - The todo list context object.
 */
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
