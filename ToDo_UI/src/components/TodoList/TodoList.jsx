// perhaps rename it to Parent tasks todo list

import React, { useState } from "react";
import TodoItem from "../TodoItem/TodoItem";
import { useTodoContext } from "../../contexts/TodoContext";
import { getTodoAndSubTasks } from "../../utils/api";

const TodoList = () => {
  const { todos, addTask, selectedList, selectTask } = useTodoContext();
  const [newTaskName, setNewTaskName] = useState("");

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

  // This function will handle when a todo item is clicked.
  const handleTodoClick = async (taskId) => {
    const fllTask = await getTodoAndSubTasks(taskId);
    selectTask(taskId);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Add a new task..."
        className="p-2 rounded bg-opacity-70 text-black"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
      />
      <button
        onClick={handleAddTask}
        className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
      >
        Add Task
      </button>
      {todos && todos.length > 0 ? (
        // Here's the filtering step
        todos
          .filter((todo) => !todo.parent_task_id)
          .map((todo) => (
            <div
              key={todo.task_id}
              onClick={() => handleTodoClick(todo.task_id)}
              className="cursor-pointer"
            >
              <TodoItem todo={todo} />
            </div>
          ))
      ) : (
        <p className="text-gray-500">No tasks available.</p>
      )}
    </div>
  );
};

export default TodoList;
