import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticate } from "./fetchApi";

const CartProtectedRoute = ({ children }) => {
  const hasItemsInCart = JSON.parse(localStorage.getItem("cart"))?.length > 0;

  if (hasItemsInCart && isAuthenticate()) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default CartProtectedRoute;
