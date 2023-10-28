import React, { useState, useEffect } from "react";
import Sidebar from "./SideListContainer";
import TaskWrapper from "./TaskWrapper";
import { useTodoContext } from "../../contexts/TodoContext";
import { DragDropContext } from "react-beautiful-dnd";

export default function TodoListContainer() {
  const { loading, error } = useTodoContext();
  const [showLoading, setShowLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { moveTask } = useTodoContext(); // for drag and drop

  // Function to handle updates in localStorage
  const handleStorageChange = () => {
    const darkModeStatus = localStorage.getItem("darkMode");
    setIsDark(darkModeStatus === "enabled");
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Assuming your draggableId is the task_id and destination.droppableId is list_id
    moveTask(draggableId, destination.droppableId);
  };

  useEffect(() => {
    // Set initial state
    handleStorageChange();

    // Attach event listener to the window to listen for any changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 300);
    } else {
      setShowLoading(false);
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  if (showLoading)
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          isDark ? "text-black bg-gray-100" : "text-white bg-gray-900"
        }`}
      >
        <div className="animate-spin mr-3">🔄</div>
        <div>Loading...</div>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={`flex h-screen ${
          isDark ? "text-black bg-gray-100" : "text-white bg-gray-900"
        }`}
      >
        <Sidebar />
        <TaskWrapper />
      </div>
    </DragDropContext>
  );
}
