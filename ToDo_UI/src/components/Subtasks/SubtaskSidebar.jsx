import React, { useState } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function SubtaskSidebar({ task, onAddSubtask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const { addSubtask } = useTodoContext();
  if (!task || typeof task !== "object") {
    return <div>No task Selected</div>;
  }
  const handleSubmit = () => {
    addSubtask(task.list_id, task.id, newSubtask);
    setNewSubtask("");
    setIsAdding(false);
  };

  return (
    <aside className="flex flex-col bg-gray-700 w-2/5 p-4">
      {task && task.task_name && (
        <h1 className="text-white mb-2">{task.task_name}</h1>
      )}
      <h2 className="text-white mb-2">Subtasks</h2>
      {task.subtasks &&
        task.subtasks.map((subtask, index) => (
          <div key={index} className="text-white mt-2">
            - {subtask}
          </div>
        ))}

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
