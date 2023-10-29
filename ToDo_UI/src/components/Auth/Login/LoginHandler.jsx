import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

/**
 * A component that handles the login process and passes the handleLoginSubmit function to its children.
 * @param {ReactElement} children - The child components of this component.
 * @returns {ReactElement} - The child components with the handleLoginSubmit function passed as a prop.
 */
function LoginHandler({ children }) {
  // Get the navigate function from the useNavigate hook
  const navigate = useNavigate();

  // Get the login function from the AuthContext context
  const { login } = useContext(AuthContext);

  /**
   * Handles the login submit event.
   * @param {object} credentials - An object with email and password properties.
   */
  const handleLoginSubmit = async ({ email, password }) => {
    // Call the login function with the email and password properties
    const result = await login({ email, password });

    // If the result has a token property, navigate to the home page
    if (result.token) {
      navigate("/");
    } else if (result.message) {
      // If the result has a message property, log an error message to the console
      console.error("Login failed: " + result.message);
    }
  };

  // Return the child components with the handleLoginSubmit function passed as a prop
  return <>{React.cloneElement(children, { handleLoginSubmit })}</>;
}

export default LoginHandler;
