import axios from "axios";
const API_URL = "/api/auth/login"; // sửa lại đúng endpoint backend

const login = async (email, password) => {
  const res = await axios.post(API_URL, { email, password });

  // Lưu token vào localStorage
  localStorage.setItem("token", res.data.token);
  return res.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default { login, logout };