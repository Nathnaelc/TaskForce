import React, { useState, useEffect } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function TodoListSidebar() {
  const { lists, selectedList, setSelectedList, addList, noListsAvailable } =
    useTodoContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );

  useEffect(() => {
    const darkModeStatus = localStorage.getItem("darkMode") === "enabled";
    setIsDarkMode(darkModeStatus);
    console.log("darkModeStatus:", darkModeStatus);
  }, []);

  const handleAddNewList = async (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      await addList(newListName);
      setNewListName("");
      setIsAdding(false);
    }
  };

  return (
    <aside
      className={`w-1/6 p-4 border-r ${
        isDarkMode
          ? "border-gray-800 dark:border-gray-400 dark:bg-gray-900"
          : "border-gray-300 bg-gray-100"
      }`}
    >
      <h2
        className={`text-xl mb-4 ${
          isDarkMode ? "text-blue-700" : "text-blue-900"
        }`}
      >
        Todo Lists
      </h2>
      {lists.map((list) => (
        <div
          key={list.list_id}
          onClick={() => setSelectedList(list)}
          className={`py-2 px-4 cursor-pointer ${
            selectedList && selectedList.list_id === list.list_id
              ? isDarkMode
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-gray-200"
              : isDarkMode
              ? "text-black dark:text-gray-400"
              : "text-gray-700"
          } ${isDarkMode ? "dark:hover:bg-gray-600" : "hover:bg-gray-200"} ${
            isDarkMode
              ? "border-gray-300 dark:border-gray-700"
              : "border-gray-200"
          }`}
        >
          {list.list_name}
        </div>
      ))}
      {noListsAvailable && (
        <div
          className={`py-2 px-4 mt-4 ${
            isDarkMode
              ? "text-red-500 border-t border-gray-400 dark:border-gray-700 dark:text-red-400"
              : "text-red-600 border-t border-gray-200"
          }`}
        >
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
            className={`py-2 px-4 flex-grow border-t ${
              isDarkMode
                ? "border-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-700"
                : "border-gray-200 bg-gray-50"
            }`}
          />
          <div className="mt-2">
            <button
              type="submit"
              className={`py-2 px-4 ${
                isDarkMode
                  ? "bg-gray-300 cursor-pointer hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  : "bg-gray-500 cursor-pointer hover:bg-gray-600"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={`py-2 px-4 mt-4 ${
            isDarkMode
              ? "hover:bg-gray-300 cursor-pointer border-t border-gray-400 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400"
              : "hover:bg-gray-600 cursor-pointer border-t border-gray-200 text-white bg-blue-500"
          }`}
        >
          + Add New List
        </button>
      )}
    </aside>
  );
}
