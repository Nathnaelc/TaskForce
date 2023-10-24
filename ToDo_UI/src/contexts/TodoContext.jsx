import React, { createContext, useState, useEffect, useContext } from "react";
import {
  fetchTodoLists,
  addNewList,
  getAllTodosForList,
  getTodoWithSubtasks,
  addTodo,
  addSubtaskAPI,
} from "./../utils/api";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noListsAvailable, setNoListsAvailable] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  // for loading the todos
  useEffect(() => {
    if (selectedList) {
      async function loadTodos() {
        try {
          setLoading(true);
          const data = await getAllTodosForList(selectedList.list_id);
          setTodos(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      loadTodos();
    }
  }, [selectedList]);

  // This function will be used to select a task and render its subtasks on the sidebar
  const selectTask = (taskId) => {
    const task = todos.find((todo) => todo.id === taskId);
    if (task) {
      setSelectedTask(task);
    } else {
      console.error("Task with ID", taskId, "not found!");
    }
  };

  //for deubgging
  useEffect(() => {
    console.log("Selected task changed:", selectedTask);
  }, [selectedTask]);
  //for deubgging

  useEffect(() => {
    console.log("TodoProvider re-rendered");
  });

  useEffect(() => {
    console.log("Selected task changed:", selectedTask);
  }, [selectedTask]);

  const deselectTask = () => {
    setSelectedTask(null);
  };

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

  const addSubtask = async (listId, parentId, taskName) => {
    console.log("Parent ID at the start of addSubtask:", parentId);
    if (!parentId) {
      console.error(
        "Parent ID is undefined. Cannot proceed with adding subtask."
      );
      return;
    }
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const newSubtask = {
        list_id: listId,
        parent_task_id: parentId,
        user_id: userId,
        task_name: taskName,
      };
      const addedSubtask = await addSubtaskAPI(parentId, newSubtask); // Corrected API call
      const updatedTaskWithSubtasks = await getTodoWithSubtasks(parentId);
      setSelectedTask(updatedTaskWithSubtasks);
      setTodos((prev) => {
        const updatedTodos = [...prev];
        const taskIndex = updatedTodos.findIndex(
          (task) => task.task_id === parentId
        );
        if (taskIndex !== -1) {
          updatedTodos[taskIndex] = updatedTaskWithSubtasks;
        }
        return updatedTodos;
      });
    } catch (error) {
      console.error("Error in addSubtask:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addList = async (listName) => {
    try {
      const userId = localStorage.getItem("userId");
      const newList = await addNewList(userId, listName);
      setLists((prevLists) => [...prevLists, newList]);
    } catch (error) {
      console.error("Error adding new list:", error);
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
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
