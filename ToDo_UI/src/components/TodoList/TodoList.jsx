import React, { useState } from "react";
import TodoItem from "../TodoItem/TodoItem";
import { useTodoContext } from "../../contexts/TodoContext";
import { getTodoAndSubTasks } from "../../utils/api";

const TodoList = () => {
  const { todos, addTask, selectedList, selectTask } = useTodoContext();
  const [newTaskName, setNewTaskName] = useState("");
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [isCompletedSectionOpen, setCompletedSectionOpen] = useState(false);

  const handleAddTask = async () => {
    if (newTaskName) {
      const userId = localStorage.getItem("userId");
      const newTask = {
        task_name: newTaskName,
        list_id: selectedList.list_id,
        user_id: userId,
      };
      await addTask(newTask);
      setNewTaskName("");
    }
  };

  const handleTodoClick = async (taskId) => {
    const fullTask = await getTodoAndSubTasks(taskId);
    setActiveTodoId(taskId);
    selectTask(taskId);
  };

  return (
    <div className="space-y-2 w-full font-medium">
      <form
        className="flex items-center space-x-2 mb-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
        }}
      >
        <input
          type="text"
          placeholder="Add a new task..."
          className="p-2 rounded text-black flex-grow dark:bg-gray-700 dark:text-white"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 pl-12 pr-12 text-blue-600 p-2 dark:text-blue-300 bg-blue-200 dark:bg-blue-800 rounded px-2"
        >
          Add Task
        </button>
      </form>
      {todos && todos.length > 0 ? (
        todos
          .filter((todo) => !todo.parent_task_id && !todo.is_completed) // Added filter for incomplete tasks
          .map((todo) => (
            <div
              key={todo.task_id}
              onClick={() => handleTodoClick(todo.task_id)}
              className={`cursor-pointer p-2 rounded mb-1 dark:bg-gray-700 ${
                activeTodoId === todo.task_id
                  ? "bg-opacity-80 text-black border border-blue-300 dark:border-blue-500"
                  : "text-black dark:text-white"
              }`}
            >
              <TodoItem todo={todo} />
            </div>
          ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No tasks available.</p>
      )}
      {/* Divider with added margin */}
      <hr className="my-4 mt-8" />

      {/* Completed Section */}
      <div onClick={() => setCompletedSectionOpen(!isCompletedSectionOpen)}>
        <h2 className="text-xl text-black dark:text-white">
          {" "}
          {/* Adjusted font size and color */}
          {isCompletedSectionOpen ? "▼ " : "▶ "}Completed
        </h2>
      </div>

      {/* Completed Tasks */}
      {isCompletedSectionOpen &&
        todos
          .filter((todo) => todo.is_completed) // Filter for completed tasks
          .map((todo) => <TodoItem key={todo.task_id} todo={todo} />)}
    </div>
  );
};

export default TodoList;
