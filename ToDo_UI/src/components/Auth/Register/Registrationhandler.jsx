import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

/**
 * A component that handles the registration process and passes the handleRegistrationSubmit function to its children.
 * @param {ReactElement} children - The child components of this component.
 * @returns {ReactElement} - The child components with the handleRegistrationSubmit function passed as a prop.
 */
function RegistrationHandler({ children }) {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  // State to store the error message
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegistrationSubmit = async ({ email, fullName, password }) => {
    const result = await register({ email, fullName, password });

    if (result.success) {
      navigate("/");
    } else {
      // Set a user-friendly error message
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      {/* Render error message if it exists */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Pass down the handleRegistrationSubmit function */}
      {React.cloneElement(children, { handleRegistrationSubmit })}
    </>
  );
}

export default RegistrationHandler;
