import axios from "axios";
const API_URL = "/api/auth/login"; // sửa lại đúng endpoint backend

const login = async (email, password) => {
  const res = await axios.post(API_URL, { email, password });

  // Lưu token vào localStorage
  localStorage.setItem("token", res.data.token);
  return res.data;
};
const getProfile = async (accountId) => {

}
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const fetchProfile = async (user) => {
  if (!user) throw new Error("User not found");
  if (user.role === "Teacher" || user.role === "Parent") {
    const url =
      user.role === "Teacher"
        ? `/api/teacher/${user.id}`
        : `/api/parent/${user.id}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } else {
    throw new Error("Invalid user role");
  }
};

export default { login, logout, fetchProfile };