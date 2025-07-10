

const ClassTimetableRepository = require('../repositories/ClassTimetableRepository');
const TeacherRepository = require('../repositories/TeacherRepository');

const getScheduleForTeacher = async (userId) => {
    
    const teacher = await TeacherRepository.findByUserId(userId);
    if (!teacher) {
        throw new Error('Teacher profile not found for the current user.');
    }

    
    return await ClassTimetableRepository.findByTeacherId(teacher._id);
};

module.exports = {
    getScheduleForTeacher,
};