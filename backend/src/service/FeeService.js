const FeeRepository = require('../repositories/FeeRepository');

exports.getAllFees = () => {
  return FeeRepository.getAllFees();
};

exports.createFee = (data) => {
  return FeeRepository.createFee(data);
};

exports.updateFee = (id, data) => {
  return FeeRepository.updateFee(id, data);
};

exports.deleteFee = (id) => {
  return FeeRepository.deleteFee(id);
}; 