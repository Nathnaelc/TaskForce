import React, { useContext } from "react";
import { TodoProvider } from "./contexts/TodoContext";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import CompletedTasks from "./components/CompletedTasks";
// import DragDropWrapper from "./components/DragDropWrapper/DragDropWrapper";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RegistrationPage from "./components/Auth/Register/RegistrationPage";
import RegistrationHandler from "./components/Auth/Register/Registrationhandler";
import LoginPage from "./components/Auth/Login/LoginPage";
import LoginHandler from "./components/Auth/Login/LoginHandler";
import NavBar from "./components/Navbar/Navbar";
import TodoListContainer from "./components/TodoListContainer/TodoListContainer";
import TaskWrapper from "./components/TodoListContainer/TaskWrapper";

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
  const { isLoggedIn, setIsLoggedIn, setUserData, userData } =
    useContext(AuthContext);

  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        setLoggedIn={setIsLoggedIn}
        user={userData}
        setUser={setUserData}
      />

      <Routes>
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <TodoProvider>
                <TodoListContainer />
              </TodoProvider>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
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
              <Navigate to="/home" replace />
            ) : (
              <RegistrationHandler>
                <RegistrationPage />
              </RegistrationHandler>
            )
          }
        />
        {/* place holder text for dashboard */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <h1>you are logged in</h1>
            ) : (
              <h1>You are not logged in</h1>
            )
          }
        />

        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </>
  );
}
