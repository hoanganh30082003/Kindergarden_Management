
const Attendance = require('../model/AttendanceModel');


const createOrUpdateAttendance = async (studentId, classId, date, status) => {
    const filter = { student_id: studentId, date: date };
    const update = { class_id: classId, status: status };
    const options = { new: true, upsert: true };

    return await Attendance.findOneAndUpdate(filter, update, options);
};

const getAttendanceByClassAndDate = async (classId, date) => {
    return await Attendance.find({ class_id: classId, date: date }).populate('student_id', 'full_name');
};

module.exports = {
    createOrUpdateAttendance,
    getAttendanceByClassAndDate,
};