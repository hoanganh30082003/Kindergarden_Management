const StudentRepository = require('../repositories/StudentRepository');
const StudentModel = require('../model/StudentModel');

exports.getAllStudents = async () => {
  // Lấy tất cả học sinh, populate parent và class
  return await StudentModel.find()
    .populate('parent_id', 'full_name')
    .populate('class_id', 'class_name');
};

exports.createStudent = async (data) => {
  const student = new StudentModel(data);
  await student.save();
  return student;
};

exports.updateStudent = async (id, data) => {
  return await StudentModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteStudent = async (id) => {
  return await StudentModel.findByIdAndDelete(id);
};

exports.getStudentsByClass = async (classId) => {
  return await StudentRepository.findByClassId(classId);
}; 