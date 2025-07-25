const ClassRepository = require('../repositories/ClassRepository');
const TeacherRepository = require('../repositories/TeacherRepository');

exports.getAllClasses = () => {
  return ClassRepository.getAllClasses();
};

exports.createClass = async (data) => {
  if (!data.class_name || !data.capacity || !data.teacher_id) {
    throw new Error('Missing required fields');
  }
  const teacher = await TeacherRepository.getTeacherById(data.teacher_id);
  if (!teacher || !teacher.account_id) {
    throw new Error('Invalid teacher_id: teacher not found or missing user');
  }
  return ClassRepository.createClass({
    class_name: data.class_name,
    capacity: data.capacity,
    teacher_id: data.teacher_id
  });
};

exports.deleteClass = (id) => {
  return ClassRepository.deleteClass(id);
}; 
exports.getClassesByTeacherAccountId = async (accountId) => {
    const teacher = await TeacherRepository.findByAccountId(accountId);
    if (!teacher) {
        return [];
    }
    return ClassRepository.findByTeacherId(teacher._id);
};