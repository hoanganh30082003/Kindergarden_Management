import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import AdminHomePage  from "../pages/AdminHomePage";
import TeacherHomePage from "../pages/TeacherHomePage";
import ParentHomePage from "../pages/ParentHomePage";
import AccountantHomePage from "../pages/AccountantHomePage";
const PrivateRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>You do not have permission to access this page.</div>;
  }
  return children;
};

export default PrivateRoute;
