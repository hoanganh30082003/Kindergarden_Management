import axios from "axios";

const API_URL = "/api/payment";

const createPayment = async (paymentData) => {
  const res = await axios.post(`${API_URL}`, paymentData);
  return res.data;
};

const getPaymentsByParentId = async (accountId) => {
  const res = await axios.get(`${API_URL}/${accountId}`);
  return res.data.data;
};

const createPaymentUrl = async (paymentData) => {
  const res = await axios.post(`${API_URL}/create_payment_url`, paymentData);
  return res.data;
};

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
  const res = await axios.get(`${API_URL}/detail/${id}`);
  return res.data.data;
};

const getParentTransactionHistory = async (accountId) => {
  const res = await axios.get(`${API_URL}/history?accountId=${accountId}`);
  return res.data.data;
};

  
const getTransactionHistory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/transactions?${queryString}`, getAuthHeaders());
  return res.data;
};

export default {
  getPaymentRecords,
  getPaymentDetail,
  getParentTransactionHistory,
  createPayment, getPaymentsByParentId, createPaymentUrl, getPaymentDetail, getTransactionHistory
};
