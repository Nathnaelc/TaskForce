import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import LoginErrorDisplay from "./LoginErrorDisplay";

/**
 * A component that displays a login form and handles the submission of the form.
 * @param {object} handleLoginSubmit - A function that handles the submission of the login form.
 * @returns {ReactElement} - A login form.
 */
export default function LoginPage({ handleLoginSubmit }) {
  // Set up state for the email, password, and login error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginError } = useAuth();

  // Get the navigate function from the useNavigate hook
  const navigate = useNavigate();

  /**
   * Handles the submission of the login form.
   * @param {object} e - The form submission event.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    // Call the handleLoginSubmit function with the email, password, and navigate properties
    handleLoginSubmit({
      email,
      password,
      navigate,
    });
  };

  // Return the login form
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 rounded shadow-md bg-white dark:bg-gray-800 w-96">
        <h1 className="text-2xl mb-3 font-bold text-blue-500 text-center">
          Login to taskforce
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="mb-4">
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-500"
            />
          </div>

          {/* Display the login error if there is one */}
          {loginError && <LoginErrorDisplay error={loginError} />}

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="p-2 w-full bg-blue-500 hover:bg-blue-600 text-white rounded dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Need an account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
