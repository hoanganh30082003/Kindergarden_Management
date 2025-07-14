const PaymentModel = require('../model/PaymentModel');

const updatePaymentByVnPay = async (paymentId) =>{
    return await PaymentModel.findByIdAndUpdate(
        paymentId,
        { method: 'Online', status: 'Paid', payment_date: Date.now() },
        {new: true }
    );
}

const create = async (paymentData) => {
  return await PaymentModel.create(paymentData);
};

const findByStudentIds = async (studentIds) => {
  return await PaymentModel.find({ student_id: { $in: studentIds }, status: 'Pending' }).populate('student_id');
};

const getPaymentById = async (paymentId) => {
  return await PaymentModel.findById(paymentId).populate('student_id');
};

const getPaidPaymentsByStudentId = async (studentIds) => {
  return await PaymentModel.find({ student_id: { $in: studentIds }, status: 'Paid' }).populate('student_id');
};

module.exports = {
    updatePaymentByVnPay,
    create,
    findByStudentIds,
    getPaymentById,
    getPaidPaymentsByStudentId
}