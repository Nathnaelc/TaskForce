import React, { useEffect } from "react";
import { useTodoContext } from "../../contexts/TodoContext";
import SubtaskComponent from "../TodoList/SubTaskList";

export default function SubtaskSidebar({ task }) {
  useEffect(() => {
    console.log("Initial task in sidebar:", task);
  }, [task]);

  const isValidTask = (task) => {
    return task && typeof task === "object" && task.task_id && task.task_name;
  };

  const renderContent = () => {
    if (!isValidTask(task)) {
      return <div className="text-black dark:text-white">No task Selected</div>;
    }
    return (
      <aside
        className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <h2 className="mb-4">Subtasks of {task.task_name}</h2>
        <div className="mt-4">
          <SubtaskComponent task={task} />
        </div>
      </aside>
    );
  };

  return renderContent();
}
