import React, { useState } from "react";
import TodoItem from "../TodoItem/TodoItem";
import { useTodoContext } from "../../contexts/TodoContext";
import { getTodoAndSubTasks } from "../../utils/api";

const TodoList = () => {
  const {
    todos,
    addTask,
    selectedList,
    setSelectedList,
    selectTask,
    lists,
    moveTask,
  } = useTodoContext();
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

  const handleMoveTask = async (taskId, newListId) => {
    if (newListId !== selectedList.list_id) {
      await moveTask(taskId, newListId);
      const newSelectedList = lists.find((list) => list.list_id === newListId);
      setSelectedList(newSelectedList);
    }
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
          className="p-2 rounded text-black flex-grow bg-gray-200 dark:bg-gray-700 dark:text-white"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 pl-12 pr-12 text-blue-600 p-2 bg-blue-200 dark:bg-blue-800 rounded px-2"
        >
          Add Task
        </button>
      </form>

      {todos && todos.length > 0 ? (
        todos
          .filter((todo) => !todo.parent_task_id && !todo.is_completed)
          .map((todo, index) => (
            <div key={todo.task_id}>
              <div
                onClick={() => handleTodoClick(todo.task_id)}
                className={`cursor-pointer p-2 rounded mb-1 bg-gray-200 dark:bg-gray-700 ${
                  activeTodoId === todo.task_id
                    ? "border border-blue-300 dark:border-blue-500"
                    : "text-black dark:text-white"
                }`}
              >
                <TodoItem todo={todo} />
                {/* Dropdown to move task */}
                <select
                  defaultValue=""
                  onChange={(e) => handleMoveTask(todo.task_id, e.target.value)}
                  className="float-right mt-[-25px] bg-white dark:bg-gray-700 dark:text-white text-black rounded border border-gray-300 dark:border-gray-500"
                >
                  <option value="" disabled>
                    Move to list
                  </option>
                  {lists.map((list) => (
                    <option key={list.list_id} value={list.list_id}>
                      {list.list_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No tasks available.</p>
      )}

      <hr className="my-4 mt-8" />
      <div onClick={() => setCompletedSectionOpen(!isCompletedSectionOpen)}>
        <h2 className="text-xl text-black dark:text-white">
          {isCompletedSectionOpen ? "▼ " : "▶ "}Completed
        </h2>
      </div>
      {isCompletedSectionOpen &&
        todos
          .filter((todo) => todo.is_completed)
          .map((todo) => <TodoItem key={todo.task_id} todo={todo} />)}
    </div>
  );
};

export default TodoList;
