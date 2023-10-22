import React, { useState, useEffect } from "react";
import { useRef } from "react";

export default function DarkModeToggler() {
  const [isDark, setIsDark] = useState(false);
  const togglerRef = useRef();

  useEffect(() => {
    // On component mount, check local storage for dark mode preference
    const darkModeStatus = localStorage.getItem("darkMode");
    if (darkModeStatus === "enabled") {
      setIsDark(true);
      document.body.classList.add("dark");
    } else {
      setIsDark(false);
      document.body.classList.remove("dark");
    }
  }, []);
  const toggleDarkMode = () => {
    if (isDark) {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    }
    setIsDark(!isDark);
  };

  return (
    <label
      ref={togglerRef}
      onClick={toggleDarkMode}
      className={`
        toggle-switch
        inline-flex h-4 w-8 flex-shrink-0 items-center cursor-pointer rounded-full border-2 border-transparent bg-gray-300
        ${isDark ? "bg-gray-500 border-gray-400" : ""}
      `}
    >
      <span
        className={`
          toggle-indicator
          inline-block h-4 w-4 rounded-full shadow-inner
          ${isDark ? "translate-x-4 bg-white" : "translate-x-0 bg-gray-700"}
        `}
      />
    </label>
  );
}
