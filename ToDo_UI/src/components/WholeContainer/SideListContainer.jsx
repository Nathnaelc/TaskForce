import React, { useState, useEffect } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function TodoListSidebar() {
  const { lists, selectedList, setSelectedList, addList } = useTodoContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDarkMode(localStorage.getItem("darkMode") === "enabled");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
        isDarkMode ? "dark:border-gray-400 dark:bg-gray-900" : "border-gray-800"
      }`}
    >
      <h2 className="text-xl mb-4 text-blue-700">Todo Lists</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {lists.map((list) => (
            <div
              key={list.list_id}
              onClick={() => setSelectedList(list)}
              className={`py-2 px-4 hover:bg-gray-300 cursor-pointer ${
                isDarkMode ? "dark:hover:bg-gray-300" : ""
              } ${
                selectedList && selectedList.list_id === list.list_id
                  ? "bg-gray-700 dark:bg-gray-600"
                  : "text-blue-600 dark:text-gray-200"
              } border-b border-gray-300 dark:border-gray-700`}
            >
              {list.list_name}
            </div>
          ))}
          {lists.length === 0 && (
            <div className="py-2 px-4 mt-4 text-red-500 border-t border-gray-400 dark:border-gray-700 dark:text-red-400">
              No lists available. Please create one to get started.
            </div>
          )}
        </>
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
                ? "dark:bg-gray-700 dark:text-white dark:border-gray-700"
                : "border-gray-400"
            }`}
          />
          <button
            type="submit"
            className={`py-2 px-4 mt-2 ${
              isDarkMode
                ? "dark:bg-gray-700 dark:hover:bg-gray-600"
                : "bg-gray-300 hover:bg-gray-400"
            } cursor-pointer`}
          >
            Save
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={`py-2 px-4 mt-4 hover:bg-gray-300 cursor-pointer border-t ${
            isDarkMode
              ? "dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400"
              : "border-gray-400"
          }`}
        >
          + Add New List
        </button>
      )}
    </aside>
  );
}
