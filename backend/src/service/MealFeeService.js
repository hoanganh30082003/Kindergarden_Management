const MealFeeRepository = require('../repositories/MealFeeRepository');

exports.getAllMealFees = () => {
  return MealFeeRepository.getAllMealFees();
};

exports.createMealFee = (data) => {
  return MealFeeRepository.createMealFee(data);
};

exports.updateMealFeeStatus = (id, payment_status) => {
  return MealFeeRepository.updateMealFeeStatus(id, payment_status);
};

exports.deleteMealFee = (id) => {
  return MealFeeRepository.deleteMealFee(id);
}; 