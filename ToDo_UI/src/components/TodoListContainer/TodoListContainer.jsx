// TodoListContainer.js
import React, { useState, useEffect } from "react";
import Sidebar from "./SideListContainer";
import TaskWrapper from "./TaskWrapper";
import { useTodoContext } from "../../contexts/TodoContext";

export default function TodoListContainer() {
  const { loading, error } = useTodoContext();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 300); // Wait 300ms before showing loading
    } else {
      setShowLoading(false);
      clearTimeout(timer); // Clear the timer if loading completes before 300ms
    }

    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  if (showLoading)
    return (
      <div className="flex h-screen items-center justify-center text-white bg-gray-900">
        <div className="animate-spin mr-3">🔄</div>
        <div>Loading...</div>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen text-white bg-gray-900 dark:bg-black dark:text-white">
      <Sidebar />
      <TaskWrapper />
    </div>
  );
}
