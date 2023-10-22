import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage({ handleLoginSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    handleLoginSubmit({
      email,
      password,
      navigate,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 rounded shadow-md bg-white dark:bg-gray-800 w-96">
        <h1 className="text-2xl mb-3 font-bold text-blue-500 text-center">
          Login to Your Account
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

          {loginError && <p className="text-red-600">{loginError}</p>}

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
