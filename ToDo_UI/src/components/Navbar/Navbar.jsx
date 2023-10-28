import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/solid";
import DarkModeToggler from "../DarkModeToggler/DarkModeToggler";

export default function NavBar({ loggedIn, user, setUser, setLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    return () => {
      // This will clear the timer when the component is unmounted
      clearTimeout(autoCloseTimer);
    };
  }, []);

  let autoCloseTimer;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const MenuButton = ({ label, path }) => (
    <button
      onClick={() => {
        if (path === "/home" && !loggedIn) {
          handleClick();
          return;
        }
        setSelectedMenu(path);
        navigate(path);
      }}
      className={`text-gray-600 hover:bg-gray-200 px-2 py-1 rounded ${
        selectedMenu === path ? "underline" : ""
      }`}
    >
      {label}
    </button>
  );

  const handleClick = () => {
    if (!loggedIn) {
      setShowToast(true);
      autoCloseTimer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-2 h-24 shadow-md">
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link to="/" className="text-blue-500 text-2xl font-bold">
          taskforce
        </Link>
        <button
          className="md:hidden ml-auto"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MenuIcon className="h-6 w-6 text-blue-500 dark:text-blue-300" />
        </button>
        <div className={`hidden md:flex ml-auto space-x-4 items-center mr-4`}>
          <DarkModeToggler />
        </div>
        {showToast && (
          <div
            className={`fixed bottom-16 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md flex justify-between items-center`}
          >
            <span>Login or register to enter or access</span>
            <button
              type="button"
              className="text-white rounded-full p-1"
              onClick={() => setShowToast(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <div className="hidden md:flex space-x-4">
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Register
            </Link>
          </div>
        )}
      </div>
      {showMenu && (
        <div
          style={{
            backgroundColor: "white",
            zIndex: 1000,
            position: "relative",
          }}
          className="md:hidden p-2 transition-all duration-500 ease-in-out dark:bg-gray-900"
        >
          <div className="flex flex-col space-y-1">
            <MenuButton
              label="Home"
              path="/home"
              additionalClasses="ml-2 border-b-1"
            />
            {!loggedIn && (
              <button
                onClick={() => setSelectedMenu("/register")}
                className={`text-gray-600 dark:text-gray-300 hover:bg-gray-200 px-2 py-1 rounded ml-2`}
              >
                Register
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
