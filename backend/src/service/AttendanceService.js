

const AttendanceRepository = require('../repositories/AttendanceRepository');

const recordAttendance = async (classId, date, attendanceData) => {
   
    const promises = attendanceData.map(record => {
        const { studentId, status } = record;
        return AttendanceRepository.createOrUpdateAttendance(studentId, classId, date, status);
    });

    await Promise.all(promises);
    return { message: 'Attendance recorded successfully' };
};

const viewAttendance = async (classId, date) => {
    return await AttendanceRepository.getAttendanceByClassAndDate(classId, date);
};
const getAttendanceForDate = async (classId, date) => {
    const res = await axios.get(`/api/attendance/view/${classId}/${date}`, getAuthHeaders());
    return res.data;
};

module.exports = {
    recordAttendance,
    viewAttendance,
    getAttendanceForDate
};