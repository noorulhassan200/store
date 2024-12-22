import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin, isAuthenticate } from "./fetchApi";

const AdminProtectedRoute = ({ children }) => {
  if (isAdmin() && isAuthenticate()) {
    return children;
  }
  return (
    <Navigate
      to={{
        pathname: "/user/profile",
      }}
      replace
    />
  );
};

export default AdminProtectedRoute;
