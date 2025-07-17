const ParentModel = require('../model/ParentModel');

exports.findByAccountId = async (accountId) => {
    return await ParentModel.findOne({ account_id: accountId });
};
exports.getAllParents = () => {
  return ParentModel.find();
};

exports.createParent = (data) => {
  return ParentModel.create(data);
};

exports.updateParent = (id, data) => {
  return ParentModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteParent = (id) => {
  return ParentModel.findByIdAndDelete(id);
};

exports.getParentById = (id) => {
  return ParentModel.findById(id);
};
