import axios from "axios";

const API_URL = "http://localhost:9999/api/report";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getTuitionReports = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/tuition?${queryString}`, getAuthHeaders());
  return res.data;
};

const getMealFeeReports = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/meal-fee?${queryString}`, getAuthHeaders());
  return res.data;
};

export default {
  getTuitionReports,
  getMealFeeReports
};