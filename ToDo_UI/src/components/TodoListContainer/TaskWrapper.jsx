import React from "react";
import { useTodoContext } from "../../contexts/TodoContext";
import TodoList from "../TodoList/TodoList";
import SubtaskSidebar from "../Subtasks/SubtaskSidebar";

export default function TaskWrapper() {
  const { selectedTask } = useTodoContext();

  return (
    <div className="flex w-full h-full bg-gray-100 dark:bg-gray-900">
      <main className="flex-grow p-4 bg-white dark:bg-gray-800">
        <TodoList />
      </main>
      <aside className="w-1/2 bg-gray-700 p-4 dark:bg-gray-800">
        {selectedTask ? (
          <SubtaskSidebar task={selectedTask} />
        ) : (
          <div className="text-white dark:text-gray-400">No task Selected</div>
        )}
      </aside>
    </div>
  );
}
