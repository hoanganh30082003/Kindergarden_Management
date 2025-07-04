import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import AdminHomePage  from "../pages/AdminHomePage";
import TeacherHomePage from "../pages/TeacherHomePage";
import ParentHomePage from "../pages/ParentHomePage";
import AccountantHomePage from "../pages/AccountantHomePage";
const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role === "Admin") return <AdminHomePage />;
  if (user.role === "Teacher") return <TeacherHomePage />;
  if (user.role === "Parent") return <ParentHomePage />;
  if (user.role === "Accoutant") return <AccountantHomePage />;
  
  return <div> you can not access any resources.</div>
};

export default PrivateRoute;
