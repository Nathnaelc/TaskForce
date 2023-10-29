import React, { useEffect } from "react";
import { useTodoContext } from "../../contexts/TodoContext";
import SubtaskComponent from "../TodoList/SubTaskList";

/**
 * A sidebar component that displays the subtasks of a selected task.
 * @param {object} task - The selected task object.
 * @returns {ReactElement} - The subtask sidebar component.
 */
export default function SubtaskSidebar({ task }) {
  // Log the initial task when the component mounts or the task prop changes
  useEffect(() => {
    console.log("Initial task in sidebar:", task);
  }, [task]);

  /**
   * A function to check if a task object is valid.
   * @param {object} task - The task object to check.
   * @returns {boolean} - Whether the task object is valid or not.
   */
  const isValidTask = (task) => {
    return task && typeof task === "object" && task.task_id && task.task_name;
  };

  /**
   * A function to render the content of the sidebar.
   * @returns {ReactElement} - The content of the sidebar.
   */
  const renderContent = () => {
    if (!isValidTask(task)) {
      // If there is no valid task, display a message
      return <div className="text-black dark:text-white">No task Selected</div>;
    }
    // Otherwise, display the subtasks of the selected task
    return (
      <aside
        className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <h2 className="text-xl mb-4">Subtasks of {task.task_name}</h2>
        <div className="mt-4">
          <SubtaskComponent task={task} />
        </div>
      </aside>
    );
  };

  // Render the content of the sidebar
  return renderContent();
}
