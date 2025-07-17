// src/services/teacherService.js

import axios from "axios";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Lấy danh sách lớp học mà giáo viên đang phụ trách
const getMyClasses = async () => {
    const res = await axios.get("/api/class/my-classes", getAuthHeaders());
    return res.data;
};

// Lấy danh sách học sinh của một lớp cụ thể
const getStudentsByClass = async (classId) => {
    const res = await axios.get(`/api/student/by-class/${classId}`, getAuthHeaders());
    return res.data;
};

// Ghi nhận điểm danh
const recordAttendance = async (attendanceData) => {
    const res = await axios.post("/api/attendance/record", attendanceData, getAuthHeaders());
    return res.data;
};

const getAttendanceForDate = async(classId, date) =>{
    const res = await axios.get(`/api/attendance/view/${classId}/${date}`, getAuthHeaders());
    return res.data;
}

export default { getMyClasses, getStudentsByClass, recordAttendance, getAttendanceForDate };