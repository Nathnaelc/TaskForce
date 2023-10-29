import React, { useState, useEffect } from "react";
import TodoListSidebar from "./SideListContainer";
import TaskWrapper from "./TaskWrapper";
import { useTodoContext } from "../../contexts/TodoContext";

/**
 * A component that displays the TodoListSidebar and TaskWrapper components and handles loading and error states.
 * @returns {ReactElement} - The todo list container component.
 */
export default function TodoListContainer() {
  const { loading, error } = useTodoContext();
  const [showLoading, setShowLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  /**
   * A function to handle updates in localStorage and set the isDark state accordingly.
   */
  const handleStorageChange = () => {
    const darkModeStatus = localStorage.getItem("darkMode");
    setIsDark(darkModeStatus === "enabled");
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
    <div
      className={`flex h-screen ${
        isDark ? "text-black bg-gray-100" : "text-white bg-gray-900"
      }`}
    >
      <TodoListSidebar />
      <TaskWrapper />
    </div>
  );
}
