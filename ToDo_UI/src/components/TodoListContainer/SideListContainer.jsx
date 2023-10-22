import React, { useState } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function Sidebar() {
  const { lists, selectedList, setSelectedList, addList, noListsAvailable } =
    useTodoContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleAddNewList = async () => {
    if (newListName.trim()) {
      await addList(newListName);
      setNewListName("");
      setIsAdding(false);
    }
  };

  return (
    <aside className="w-1/6 p-4 border-r border-gray-800">
      {lists.map((list) =>
        list ? (
          <div
            key={list.list_id}
            onClick={() => setSelectedList(list)}
            className={`py-2 px-4 hover:bg-gray-800 cursor-pointer ${
              selectedList && selectedList.list_id === list.list_id
                ? "bg-gray-700"
                : ""
            }`}
          >
            {list.list_name}
          </div>
        ) : null
      )}
      {noListsAvailable && (
        <div className="py-2 px-4 mt-4 text-red-500 border-t border-gray-400 dark:border-gray-700">
          No lists available. Please create one to get started.
        </div>
      )}

      {isAdding ? (
        <div className="flex mt-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name..."
            className="py-2 px-4 flex-grow border-t border-gray-400 dark:border-gray-700"
          />
          <button
            onClick={handleAddNewList}
            className="py-2 px-4 ml-2 bg-gray-300 cursor-pointer hover:bg-gray-400"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="py-2 px-4 mt-4 hover:bg-gray-300 cursor-pointer border-t border-gray-400 dark:border-gray-700 hover:text-black"
        >
          + Add New List
        </button>
      )}
    </aside>
  );
}
