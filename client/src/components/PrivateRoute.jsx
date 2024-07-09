// client/src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../redux/hooks";

/**
 * Private route component to protect routes that requires authentication.
 * @param {object} props - Component props.
 * @param {JSX.Element} props.children - Component to render if user is authenticated.
 * @returns {JSX.Element} - Either redirects to login page or renders the child component.
 */
const PrivateRoute = ({ children }) => {
  const user = useUser();

  if (user === undefined) {
    // If user data is still being fetched, show a loading state
    return <div>Loading...</div>;
  }

  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  // If logged in, render the child component
  return children;
};

export default PrivateRoute;