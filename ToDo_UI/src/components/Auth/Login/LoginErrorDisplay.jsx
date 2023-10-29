import React from "react";

/**
 * A component that displays an error message related to the login process.
 * @param {string} error - The error message to be displayed.
 * @returns {JSX.Element} - A div element with the error message as its text content.
 */
export default function LoginErrorDisplay({ error }) {
  return (
    <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
      {error}
    </div>
  );
}
