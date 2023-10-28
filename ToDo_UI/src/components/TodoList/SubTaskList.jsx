import React, { useState } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function SubtaskComponent({ task, depth = 0 }) {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [newSubtask, setNewSubtask] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const { addSubtask, deleteTaskAndSubtasks } = useTodoContext();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const isDarkMode = localStorage.getItem("isDarkMode") === "true";

  const subTasks = task?.subTasks || [];

  const handleAddSubtask = () => {
    if (task && task.task_id) {
      addSubtask(task.list_id, task.task_id, newSubtask);
      setNewSubtask("");
      setIsAddingSubtask(false);
    }
  };

  const handleConfirmDelete = async () => {
    await deleteTaskAndSubtasks(task.task_id);
    setIsDeleted(true);
    setConfirmationModalOpen(false);
  };

  const handleCompleteClick = () => {
    setConfirmationModalOpen(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddSubtask();
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div
      className="subtask-section overflow-y-auto"
      style={{ marginLeft: `${depth * 20}px` }}
    >
      <div className="task-header flex items-center p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white mb-2">
        {task.subTasks && task.subTasks.length > 0 && (
          <button onClick={toggleExpand} className="mr-2 text-lg">
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
        <span className="flex-grow">{task.task_name}</span>
        <button
          onClick={handleCompleteClick}
          className="text-green-600 dark:text-green-300 bg-green-200 dark:bg-green-800 rounded px-2"
        >
          Complete
        </button>
        {isAddingSubtask ? (
          <div className="flex items-center ml-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={handleKeyPress}
              className="p-1 rounded dark:bg-gray-700 dark:text-white mr-2"
              placeholder="Add subtask..."
            />
            <button
              onClick={handleAddSubtask}
              className="text-blue-600 dark:text-blue-300"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingSubtask(true)}
            className="ml-2 text-blue-600 dark:text-blue-300 bg-blue-200 dark:bg-blue-800 rounded px-2"
          >
            + Add Subtask
          </button>
        )}
      </div>
      {isExpanded &&
        task.subTasks &&
        task.subTasks.map((subtask) => (
          <SubtaskComponent
            key={subtask.task_id}
            task={subtask}
            depth={depth + 1}
          />
        ))}
      {isConfirmationModalOpen && (
        <div
          className={`custom-modal p-4 rounded shadow-lg ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <p className="mb-2">
            Are you sure you want to complete and delete this task and its
            subtasks?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleConfirmDelete}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? "bg-red-700 hover:bg-red-800"
                  : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmationModalOpen(false)}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-300 hover:bg-gray-400"
              } text-black`}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
