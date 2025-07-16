const TuitionFee = require('../model/TuitionFeeModel');

exports.getAllFees = () => {
  return TuitionFee.find().populate('class_id');
};

exports.createFee = (data) => {
  return TuitionFee.create(data);
};

exports.updateFee = (id, data) => {
  return TuitionFee.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteFee = (id) => {
  return TuitionFee.findByIdAndDelete(id);
}; 