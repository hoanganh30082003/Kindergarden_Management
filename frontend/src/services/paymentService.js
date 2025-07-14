import axios from "axios";

const API_URL = "http://localhost:9999/api/payments";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getPaymentRecords = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/records?${queryString}`, getAuthHeaders());
  return res.data;
};

const getPaymentDetail = async (id) => {
  const res = await axios.get(`${API_URL}/detail/${id}`, getAuthHeaders());
  return res.data;
};

const getTransactionHistory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/transactions?${queryString}`, getAuthHeaders());
  return res.data;
};

export default {
  getPaymentRecords,
  getPaymentDetail,
  getTransactionHistory
};