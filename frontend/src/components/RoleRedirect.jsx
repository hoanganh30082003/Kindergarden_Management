import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const RoleRedirect = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Teacher") navigate("/teacher");
      else if (user.role === "Parent") navigate("/parent");
      else if (user.role === "Accountant") navigate("/accountant");
    }
  }, [user, navigate]);

  return null;
};

export default RoleRedirect;
