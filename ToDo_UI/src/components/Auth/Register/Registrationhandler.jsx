import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

/**
 * A component that handles the registration process and passes the handleRegistrationSubmit function to its children.
 * @param {ReactElement} children - The child components of this component.
 * @returns {ReactElement} - The child components with the handleRegistrationSubmit function passed as a prop.
 */
function RegistrationHandler({ children }) {
  // Get the navigate function from the useNavigate hook
  const navigate = useNavigate();

  // Get the register function from the AuthContext context
  const { register } = useContext(AuthContext);

  /**
   * Handles the registration submit event.
   * @param {object} credentials - An object with email, fullName, and password properties.
   */
  const handleRegistrationSubmit = async ({ email, fullName, password }) => {
    // Call the register function with the email, fullName, and password properties
    const result = await register({ email, fullName, password });

    // If the result has a success property, navigate to the home page of the application
    if (result.success) {
      navigate("/");
    } else {
      // If the result has a message property, display an alert with the error message
      alert("Registration failed: " + result.message); // Use a proper notification system in real-world apps
    }
  };

  // Return the child components with the handleRegistrationSubmit function passed as a prop
  return <>{React.cloneElement(children, { handleRegistrationSubmit })}</>;
}

export default RegistrationHandler;
