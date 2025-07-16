const MealFee = require('../model/MealFeeModel');

exports.getAllMealFees = () => {
  return MealFee.find().populate('class_id');
};

exports.createMealFee = (data) => {
  return MealFee.create(data);
};

exports.updateMealFeeStatus = (id, payment_status) => {
  return MealFee.findByIdAndUpdate(id, { payment_status }, { new: true });
};

exports.deleteMealFee = (id) => {
  return MealFee.findByIdAndDelete(id);
}; 