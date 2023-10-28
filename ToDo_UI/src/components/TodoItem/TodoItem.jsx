import React, { useState } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function TodoItem({ todo }) {
  const { setSelectedTask, handleToggleCompletion } = useTodoContext();
  const [showModal, setShowModal] = useState(false); // for custom modal
  const isDarkMode = localStorage.getItem("isDarkMode") === "true";

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    setShowModal(true); // show the custom modal
  };

  const handleConfirm = () => {
    const isCompleted = !todo.is_completed;
    handleToggleCompletion(todo.task_id, isCompleted);
    setShowModal(false); // close the modal
  };

  return (
    <div
      className="flex items-center space-x-3 p-1 rounded cursor-pointer dark:bg-gray-700 dark:text-white"
      onClick={() => {
        setSelectedTask(todo);
      }}
    >
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-blue-600 rounded dark:text-blue-400"
        checked={todo.is_completed}
        onClick={handleCheckboxClick}
        readOnly
      />
      <span
        className={`${
          todo.is_completed
            ? "line-through text-orange-600 dark:text-orange-600"
            : "text-black dark:text-white"
        } text-base font-400`}
      >
        {todo.task_name}
      </span>

      {showModal && (
        <div
          className={`modal rounded p-4 ${
            isDarkMode ? "bg-gray-800 text-gray-400" : "bg-white text-black"
          }`}
        >
          <div className="modal-content">
            <span
              className="close text-lg mb-2"
              onClick={() => setShowModal(false)}
            >
              &times;
            </span>
            <p className="mb-4">
              {todo.is_completed
                ? "Are you sure you want to recover this task?"
                : "Are you sure you want to mark this task as completed?"}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirm}
                className={`text-sm px-6 py-2  ${
                  isDarkMode
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={`text-sm px-6 py-2  ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-300 hover:bg-gray-400"
                } text-black`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
