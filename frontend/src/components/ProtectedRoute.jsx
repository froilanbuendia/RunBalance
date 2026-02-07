import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt"); // check if JWT exists

  if (!token) {
    // Not authenticated → redirect to home
    return <Navigate to="/" replace />;
  }

  // Authenticated → render the child component
  return children;
};

export default ProtectedRoute;
