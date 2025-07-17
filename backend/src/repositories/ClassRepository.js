const Class = require('../model/ClassModel');

exports.getAllClasses = () => {
  return Class.find().populate({
    path: 'teacher_id',
    populate: { path: 'account_id', select: 'system_name' }
  });
};

exports.createClass = (data) => {
  return Class.create(data);
};

exports.deleteClass = (id) => {
  return Class.findByIdAndDelete(id);
}; 
exports.findByTeacherId = (teacherId) => {
    return Class.find({ teacher_id: teacherId });
};