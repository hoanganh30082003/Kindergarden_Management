const User = require('../model/UserModel');

exports.createUser = (data) => {
  return User.create(data);
};

exports.deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

exports.updateStatus = (id, status) => {
  return User.findByIdAndUpdate(id, { status }, { new: true });
};

exports.findByUsername = (username) => {
  return require('../model/UserModel').findOne({ username });
};