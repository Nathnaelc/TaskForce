import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

/**
 * A private route component that only allows access to authenticated users.
 * @param {ReactElement} component - The component to render for the route.
 * @returns {ReactElement} - The private route component.
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  // Get the isLoggedIn state from the AuthContext context
  const { isLoggedIn } = useContext(AuthContext);

  // If the user is not logged in, redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Otherwise, render the component for the route
  return <Route {...rest} element={<Component />} />;
};

export default PrivateRoute;
