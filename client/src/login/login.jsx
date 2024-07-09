// client/src/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./login.css";
import { useUser } from "../redux/hooks.js";
import Navbar from "../navbar/Navbar";
import Form from "../components/Form";
import config from "../config.js";

const Login = () => {
  // The `useUser` hook is employed to check if a user is already authenticated when they access the login page. 
  // If the user is found to be authenticated, they are automatically redirected to the home page (/). This prevents 
  // authenticated users from accessing the login page again.
  useUser({ redirectTo: "/", redirectIfFound: true });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(""); // State variable for success message.

  const navigate = useNavigate();

  // Function to handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior.

    try {
      const body = {
        username: e.target.username.value,
        password: e.target.password.value,
      };

      // Make a POST request using axios with cookies.
      const response = await axios.post(
        `${config.serverEndpoint}/login`, body, {
          headers : {
            'Content-Type' : 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.status === 200) {
        setSuccess("Login successful"); // Set success message.
        setError(""); // Clear any previous errors.
        // If login is successful, redirect to '/'.
        setTimeout(() => {
          navigate("/"); // Redirect after 0.5 seconds.
        }, 500);        
      } else {
        // If login fails, throw an error with the response data.
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(`An unexpected error occurred: ${error.message}`);
      setError(error.response?.data?.message || error.message); // Set error message state with the error message
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      {/* Render the Form component for login */}
      <Form isLogin={true} errorMessage={error} successMessage={success} onSubmit={handleSubmit} />
    </div>
  );
};

export default Login;