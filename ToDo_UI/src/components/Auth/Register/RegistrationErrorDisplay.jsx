import React from "react";

/**
 * A component that displays an error message for registration.
 * @param {string} errorMessage - The error message to display.
 * @returns {ReactElement|null} - The error message or null if there is no error message.
 */
const RegistrationErrorDisplay = ({ errorMessage }) => {
  // If there is no error message, return null
  if (!errorMessage) return null;

  // Otherwise, return the error message
  return (
    <div className="mb-4 text-red-500 font-bold dark:text-red-400">
      {errorMessage}
    </div>
  );
};

export default RegistrationErrorDisplay;
