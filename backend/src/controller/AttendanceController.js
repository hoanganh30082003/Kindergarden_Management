const AttendanceService = require('../service/AttendanceService');


const record = async (req, res) => {
    try {
        const { classId, date, attendanceData } = req.body;
        
        const result = await AttendanceService.recordAttendance(classId, date, attendanceData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error recording attendance', error: error.message });
    }
};

const view = async (req, res) => {
    try {
        const { classId, date } = req.params;
        const attendanceList = await AttendanceService.viewAttendance(classId, date);
        res.status(200).json(attendanceList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
};

module.exports = {
    record,
    view,
};