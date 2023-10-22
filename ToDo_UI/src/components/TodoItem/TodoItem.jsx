import React from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function TodoItem({ todo }) {
  const { setSelectedTask } = useTodoContext();

  return (
    <div
      className="flex items-start space-x-4 p-2 bg-opacity-70 rounded hover:bg-gray-800 cursor-pointer"
      onClick={() => {
        console.log("Item clicked", todo);
        setSelectedTask(todo);
      }}
    >
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-blue-600 rounded-full"
        checked={todo.completed}
        readOnly
      />
      <span
        className={todo.completed ? "line-through text-gray-500" : "text-white"}
      >
        {todo.task_name}
      </span>
    </div>
  );
}
