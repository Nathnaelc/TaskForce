import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegistrationPage({ handleRegistrationSubmit }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      handleRegistrationSubmit({
        fullName,
        email,
        password,
        navigate,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 rounded shadow-md bg-white dark:bg-gray-800 w-96">
        <h1 className="text-2xl mb-3 font-bold text-blue-500 text-center">
          Create an Account
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="mb-4">
            <input
              placeholder="Full Name"
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-500"
            />
          </div>

          <div className="mb-4">
            <input
              placeholder="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <input
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <input
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-500"
            />
          </div>

          {passwordError && (
            <p className="text-red-600">Passwords do not match!</p>
          )}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="p-2 w-full bg-blue-500 hover:bg-blue-600 text-white rounded dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Already signed up?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
