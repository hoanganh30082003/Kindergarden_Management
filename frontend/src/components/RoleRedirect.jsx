import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const RoleRedirect = () => {
  const { account } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      if (account.role === "Admin") navigate("/admin");
      else if (account.role === "Teacher") navigate("/teacher");
      else if (account.role === "Parent") navigate("/parent");
      else if (account.role === "Accountant") navigate("/accountant");
    }
  }, [account, navigate]);

  return null;
};

export default RoleRedirect;
