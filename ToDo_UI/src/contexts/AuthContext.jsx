import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const register = async ({ email, fullName, password }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        email,
        fullName,
        password,
      });

      // Check if the status code is in the 200s to ensure success
      if (response.status >= 200 && response.status < 300) {
        setUserData(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userId", response.data.user.user_id);

        setIsLoggedIn(true);
        return { success: true, message: response.data.message };
      } else {
        console.error("Registration failed:", response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        success: false,
        message: error.message || "Error during registration",
      };
    }
  };
  const login = async ({ email, password, navigate }) => {
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
        return { success: true };
      } else {
        return { error: data.message };
      }
    } catch (error) {
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
