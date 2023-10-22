// main wrapper for the todo list and subtask sidebar
import React from "react";
import { useTodoContext } from "../../contexts/TodoContext";
import TodoList from "../TodoList/TodoList";
import SubtaskSidebar from "../Subtasks/SubtaskSidebar";

export default function TaskWrapper() {
  const { selectedTask } = useTodoContext();

  return (
    <div className="flex w-full h-full">
      <main className="w-3/5 p-4">
        <TodoList />
      </main>
      {console.log("Selected Task:", selectedTask)}
      {selectedTask ? (
        <SubtaskSidebar task={selectedTask} />
      ) : (
        <div>No task Selected right</div>
      )}
    </div>
  );
}
