const Parent = require('../model/ParentModel');

exports.getAllParents = () => {
  return Parent.find().populate('user_id', 'username email phone status');
};

exports.createParent = (data) => {
  return Parent.create(data);
};

exports.updateParent = (id, data) => {
  return Parent.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteParent = (id) => {
  return Parent.findByIdAndDelete(id);
};

exports.getParentById = (id) => {
  return Parent.findById(id);
};
