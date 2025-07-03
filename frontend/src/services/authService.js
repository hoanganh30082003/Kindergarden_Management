import axios from "axios";

const API_URL = "/api/auth/login"; // sửa lại đúng endpoint backend

const login = async (username, password) => {
  const res = await axios.post(API_URL, { username, password });
  // Lưu token vào localStorage
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default { login, logout };