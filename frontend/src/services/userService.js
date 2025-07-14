import axios from "axios";

const API_URL = "http://localhost:9999/api";

const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await axios.get(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return res.data;
};

export default { getProfile };