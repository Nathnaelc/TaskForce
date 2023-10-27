import React, { useState } from "react";

const SubtaskComponent = ({ addSubtask, oldTaskName }) => {
  const [newSubtaskName, setNewSubtaskName] = useState("");

  const handleAddSubtask = () => {
    if (newSubtaskName) {
      addSubtask(newSubtaskName); // Function from parent to add the new subtask
      setNewSubtaskName(""); // Reset the input field
    }
  };

  return (
    <div className="subtask-component">
      <span>{oldTaskName}</span>
      <input
        type="text"
        placeholder="Add a subtask..."
        value={newSubtaskName}
        onChange={(e) => setNewSubtaskName(e.target.value)}
      />
      <button onClick={handleAddSubtask}>Add Subtask</button>
    </div>
  );
};

export default SubtaskComponent;
