import React, { useState, useEffect } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

/**
 * A component that displays the list of todo lists and allows the user to add new lists.
 * @returns {ReactElement} - The todo list sidebar component.
 */
export default function TodoListSidebar() {
  const { lists, selectedList, setSelectedList, addList, noListsAvailable } =
    useTodoContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );
  const [forceRender, setForceRender] = useState(0); // New state to force re-render

  /**
   * A useEffect hook that increments the forceRender state to force a re-render when the selectedList changes.
   */
  useEffect(() => {
    setForceRender((prevForceRender) => prevForceRender + 1);
  }, [selectedList]);

  /**
   * A useEffect hook that sets the isDarkMode state based on the value of the "darkMode" key in localStorage.
   */
  useEffect(() => {
    const darkModeStatus = localStorage.getItem("darkMode") === "enabled";
    setIsDarkMode(darkModeStatus);
  }, []);

  /**
   * A function to handle the submission of the new list form.
   * @param {object} e - The form submission event object.
   */
  const handleAddNewList = async (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      await addList(newListName);
      setNewListName("");
      setIsAdding(false);
    }
  };

  return (
    <aside className="w-1/6 p-4 border-r border-gray-800 dark:border-gray-400 dark:bg-gray-900">
      <h2 className="text-xl mb-4 text-blue-700">Todo Lists</h2>
      {lists.map((list) => (
        <div
          key={list.list_id}
          onClick={() => setSelectedList(list)}
          className={`py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer ${
            selectedList && selectedList.list_id === list.list_id
              ? "bg-gray-700 dark:bg-gray-600"
              : "text-black dark:text-gray-400"
          } border-b border-gray-300 dark:border-gray-700`}
        >
          {list.list_name}
        </div>
      ))}
      {noListsAvailable && (
        <div className="py-2 px-4 mt-4 text-red-500 border-t border-gray-400 dark:border-gray-700 dark:text-red-400">
          No lists available. Please create one to get started.
        </div>
      )}
      {isAdding ? (
        <form className="flex flex-col mt-4" onSubmit={handleAddNewList}>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name..."
            className="py-2 px-4 flex-grow border-t border-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-700"
          />
          <button
            type="submit"
            className="py-2 px-4 mt-2 bg-gray-300 cursor-pointer hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Save
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="py-2 px-4 mt-4 hover:bg-gray-300 cursor-pointer border-t border-gray-400 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400"
        >
          + Add New List
        </button>
      )}
    </aside>
  );
}
