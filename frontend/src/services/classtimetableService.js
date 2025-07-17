// src/services/classtimetableService.js

import axios from "axios";
const API_URL = "/api/timetable";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const getTimetableByParentId = async (parentId) => {
    const res = await axios.get(`${API_URL}/by-parent/${parentId}`, getAuthHeaders());
    return res.data;
};

// ++ Thêm hàm mới
const getMySchedule = async () => {
    const res = await axios.get(`${API_URL}/my-schedule`, getAuthHeaders());
    return res.data;
};


export default { getTimetableByParentId, getMySchedule };