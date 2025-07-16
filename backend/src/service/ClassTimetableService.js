

const ClassTimetableRepository = require('../repositories/ClassTimetableRepository');
const TeacherRepository = require('../repositories/TeacherRepository');
const ParentRepository = require('../repositories/ParentRepository');
const StudentRepository = require('../repositories/StudentRepository');

const getScheduleForTeacher = async (userId) => {

    const teacher = await TeacherRepository.findByUserId(userId);
    if (!teacher) {
        throw new Error('Teacher profile not found for the current user.');
    }


    return await ClassTimetableRepository.findByTeacherId(teacher._id);
};

const getScheduleForParent = async (parentId) => {
    const students = await StudentRepository.findByParentId(parentId);

    if (!students || students.length === 0) {
        return [];
    }

    const classIds = students.map(s => s.class_id);

    return await ClassTimetableRepository.findByClassIds(classIds);
};

module.exports = {
    getScheduleForTeacher,
    getScheduleForParent,
};