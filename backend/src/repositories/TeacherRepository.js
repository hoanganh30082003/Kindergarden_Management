const Teacher = require('../model/TeacherModel');

exports.getAllTeachers = () => {
  return Teacher.find().populate('user_id', 'username');
};

exports.createTeacher = (data) => {
  return Teacher.create(data);
};

exports.getTeacherById = (id) => {
  return require('../model/TeacherModel').findById(id).populate('user_id', 'username');
};
