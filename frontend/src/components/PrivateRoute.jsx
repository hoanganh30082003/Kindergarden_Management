import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { account } = useContext(AuthContext);
  console.log("PrivateRouter", account)
  try {
    if (!account) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(account.role)) {
      return <div>You do not have permission to access this page.</div>;
    }    
    return children;
  } catch (err) {
    console.log(err)
  }
};

export default PrivateRoute;
