const UserModel = require("../model/UserModel");

const findByUsernameAndPassword = async (username, password) => {
  return await UserModel.findOne({ username, password });
};

const updateLastLogin = async (userId) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { last_login: new Date() },
    { new: true }
  );
};

const findById = async (userId) => {
  return await UserModel.findById(userId).select("-password");
};

module.exports = {
  findByUsernameAndPassword,
  findById,
  updateLastLogin,
};
