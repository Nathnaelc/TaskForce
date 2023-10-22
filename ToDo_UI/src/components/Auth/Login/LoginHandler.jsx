import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

function LoginHandler({ children }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLoginSubmit = async ({ email, password }) => {
    const result = await login({ email, password });
    if (result.token) {
      // Check for token instead of success field
      navigate("/");
    } else if (result.message) {
      // Instead of alert, you can handle the error more gracefully here
      console.error("Login failed: " + result.message);
    }
  };

  return <>{React.cloneElement(children, { handleLoginSubmit })}</>;
}

export default LoginHandler;
