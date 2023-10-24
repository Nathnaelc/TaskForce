import React, { useState, useEffect } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function SubtaskSidebar({ task }) {
  useEffect(() => {
    console.log("Current task prop:", task);
  }, [task]);
  // Removed onAddSubtask
  const [isAdding, setIsAdding] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const { addSubtask } = useTodoContext();

  // Early return if no task is selected
  if (!task || typeof task !== "object") {
    return <div>No task Selected</div>;
  }

  const handleSubmit = () => {
    // Validate task and task ID before proceeding
    if (task && task.task_id) {
      addSubtask(task.list_id, task.task_id, newSubtask);
    } else {
      console.log("Task or task ID is undefined");
    }

    // Reset input field and disable adding state
    setNewSubtask("");
    setIsAdding(false);
  };

  return (
    <aside className="flex flex-col bg-gray-700 w-2/5 p-4">
      <h1 className="text-white mb-2">{task.task_name}</h1>
      <h2 className="text-white mb-2">Subtasks</h2>

      {/* Render subtasks if they exist */}
      {task.subTasks &&
        task.subTasks.map((subtask, index) => (
          <div key={index} className="text-white mt-2 bg-gray-700 p-2 rounded">
            - {subtask.task_name}
          </div>
        ))}

      {/* Input field and button for adding new subtask */}
      {isAdding ? (
        <div className="flex mt-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Subtask..."
            className="py-1 px-2 border rounded-md mr-2 flex-grow"
          />
          <button
            onClick={handleSubmit}
            className="px-2 py-1 bg-blue-600 text-white rounded-md"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          className="text-blue-600 mt-2"
          onClick={() => setIsAdding(true)}
        >
          + Add Subtask
        </button>
      )}
    </aside>
  );
}
