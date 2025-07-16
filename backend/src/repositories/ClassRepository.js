const Class = require('../model/ClassModel');

exports.getAllClasses = () => {
  return Class.find().populate({
    path: 'teacher_id',
    populate: { path: 'user_id', select: 'username' }
  });
};

exports.createClass = (data) => {
  return Class.create(data);
};

exports.deleteClass = (id) => {
  return Class.findByIdAndDelete(id);
}; 