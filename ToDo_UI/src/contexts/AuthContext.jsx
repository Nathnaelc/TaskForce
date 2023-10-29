import { createContext, useState, useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const AuthContext = createContext();

/**
 * A component that provides authentication context to its children.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 * @returns {ReactElement} - The authentication provider component.
 */
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  /**
   * A function to register a new user.
   * @param {Object} user - The user object containing email, fullName, and password.
   * @returns {Object} - An object containing success status and message.
   */
  const register = async ({ email, fullName, password }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // HTTP status code in the range 200-299
        setUserData(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.user_id);

        setIsLoggedIn(true);
        return { success: true, message: data.message };
      } else {
        console.error("Registration failed:", data.message);
        return {
          success: false,
          message: "Registration failed. Please try again later.",
        };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  };

  /**
   * A function to log in a user.
   * @param {Object} credentials - The user credentials object containing email and password.
   * @returns {Object} - An object containing success status or error message.
   */
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const decodedToken = jwt_decode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", decodedToken.userId);
        const userData = {
          ...decodedToken,
          email: decodedToken.email,
          fullName: `${decodedToken.firstName} ${decodedToken.lastName}`,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUserData(userData);
        setIsLoggedIn(true);
        setLoginError("");
        return { success: true };
      } else {
        setLoginError(data.message);
        return { error: data.message };
      }
    } catch (error) {
      setLoginError("Network error. Please try again.");
      return { error: "Network error. Please try again." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isLoggedIn,
        setIsLoggedIn,
        register,
        login,
        loginError,
        setLoginError,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * A hook that returns the authentication context.
 * @returns {Object} - The authentication context.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
