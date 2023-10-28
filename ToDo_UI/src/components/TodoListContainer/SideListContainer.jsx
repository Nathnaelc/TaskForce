import React, { useState } from "react";
import { useTodoContext } from "../../contexts/TodoContext";
import { Droppable } from "react-beautiful-dnd";

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
    <Droppable droppableId="sidebar">
      {(provided, snapshot) => (
        <aside
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`w-1/6 p-4 border-r border-gray-800 dark:border-gray-400 dark:bg-gray-900 ${
            snapshot.isDraggingOver ? "bg-gray-700" : ""
          }`}
        >
          {lists.map((list) =>
            list ? (
              <div
                key={list.list_id}
                onClick={() => setSelectedList(list)}
                className={`py-2 px-4 hover:bg-gray-800 dark:hover:bg-gray-600 cursor-pointer ${
                  selectedList && selectedList.list_id === list.list_id
                    ? "bg-gray-700 dark:bg-gray-600"
                    : "dark:text-gray-400"
                }`}
              >
                {list.list_name}
              </div>
            ) : null
          )}
          {provided.placeholder}
          {noListsAvailable && (
            <div className="py-2 px-4 mt-4 text-red-500 border-t border-gray-400 dark:border-gray-700 dark:text-red-400">
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
                className="py-2 px-4 flex-grow border-t border-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-700"
              />
              <button
                onClick={handleAddNewList}
                className="py-2 px-4 ml-2 bg-gray-300 cursor-pointer hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="py-2 px-4 mt-4 hover:bg-gray-300 cursor-pointer border-t border-gray-400 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400"
            >
              + Add New List
            </button>
          )}
        </aside>
      )}
    </Droppable>
  );
}
