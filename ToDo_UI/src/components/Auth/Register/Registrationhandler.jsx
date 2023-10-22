import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

function RegistrationHandler({ children }) {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleRegistrationSubmit = async ({ email, fullName, password }) => {
    const result = await register({ email, fullName, password });
    if (result.success) {
      navigate("/");
    } else {
      alert("Registration failed: " + result.message); // Use a proper notification system in real-world apps
    }
  };

  return <>{React.cloneElement(children, { handleRegistrationSubmit })}</>;
}

export default RegistrationHandler;
