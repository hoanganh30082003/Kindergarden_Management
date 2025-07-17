import axios from "axios";
const API_URL = "/api/auth/login"; 

const login = async (email, password) => {
  const res = await axios.post(API_URL, { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const fetchProfile = async (account) => {
  if (!account) throw new Error("Account not found");
  if (account.role === "Teacher" || account.role === "Parent") {
    const url =
    account.role === "Teacher"
        ? `/api/teacher/${account._id}`
        : `/api/parent/${account._id}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } else {
    throw new Error("Invalid user role");
  }
};
const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await axios.get(`/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return res.data;
};
export default { login, logout, fetchProfile, getProfile };