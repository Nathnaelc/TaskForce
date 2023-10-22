// RegistrationErrorDisplay.jsx
import React from "react";

const RegistrationErrorDisplay = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div className="mb-4 text-red-500 font-bold dark:text-red-400">
      {errorMessage}
    </div>
  );
};

export default RegistrationErrorDisplay;
