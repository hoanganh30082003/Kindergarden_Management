const StudentRepository = require('../repositories/StudentRepository');

exports.getAllStudents = async () => {
  return await StudentRepository.findAll();
};

exports.createStudent = async (data) => {
  return await StudentRepository.create(data);
};

exports.updateStudent = async (id, data) => {
  return await StudentRepository.updateById(id, data);
};

exports.deleteStudent = async (id) => {
  return await StudentRepository.deleteById(id);
};

exports.getStudentsByClass = async (classId) => {
  return await StudentRepository.findByClassId(classId);
}; 