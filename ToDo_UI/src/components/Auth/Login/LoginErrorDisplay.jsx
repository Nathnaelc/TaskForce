import React from "react";

function LoginErrorDisplay({ error }) {
  return (
    <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
      {error}
    </div>
  );
}

export default LoginErrorDisplay;
