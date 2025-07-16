

const ClassTimetableService = require('../service/ClassTimetableService');

const getMySchedule = async (req, res) => {
    try {
        
        const userId = req.user.id;
        const schedule = await ClassTimetableService.getScheduleForTeacher(userId);
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teaching schedule', error: error.message });
    }
};

const getScheduleForParent = async (req, res) => {
    try {
        const parentId = req.params.parentId;
        const schedule = await ClassTimetableService.getScheduleForParent(parentId);
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching class timetable for parent', error: error.message });
    }
};

module.exports = {
    getMySchedule,
    getScheduleForParent,
};