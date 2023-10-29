import React, { useContext } from "react";
import { TodoProvider } from "./contexts/TodoContext";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationPage from "./components/Auth/Register/RegistrationPage";
import RegistrationHandler from "./components/Auth/Register/Registrationhandler";
import LoginPage from "./components/Auth/Login/LoginPage";
import LoginHandler from "./components/Auth/Login/LoginHandler";
import NavBar from "./components/Navbar/Navbar";
import TodoListContainer from "./components/WholeContainer/TodoListContainer";
import "./App.css";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { isLoggedIn, setIsLoggedIn, setUserData, userData, isLoading } =
    useContext(AuthContext);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <TodoProvider>
      <NavBar
        loggedIn={isLoggedIn}
        setLoggedIn={setIsLoggedIn}
        user={userData}
        setUser={setUserData}
      />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <TodoListContainer />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <LoginHandler>
                <LoginPage />
              </LoginHandler>
            )
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <RegistrationHandler>
                <RegistrationPage />
              </RegistrationHandler>
            )
          }
        />
        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </TodoProvider>
  );
}
