const PaymentRepository = require('../repositories/PaymentRepository')
const StudentRepository = require('../repositories/StudentRepository');

const UpdatePaymentByVnPay = async (paymentId) =>{
    try {
        const result = await PaymentRepository.updatePaymentByVnPay(paymentId);

        if (!result) {
            throw new Error(`Payment with ID ${paymentId} not found.`);
        }
        return result;
    } catch (error) {
        console.error('Error updating payment with VNPAY:', error);
        throw error;
    }
}
const createPayment = async (data) => {
    try {
        const result = await PaymentRepository.create(data);
        return result;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
  };

const getPaymentsByParentId = async (parentId) => {
  const studentIds = await StudentRepository.findIdsByParentId(parentId);
  // Lấy payment theo studentIds
  return await PaymentRepository.findByStudentIds(studentIds);
};

const getPaidPaymentsByStudentId = async (parentId) =>{
  const studentIds = await StudentRepository.findIdsByParentId(parentId);
  // Lấy payment theo studentIds
  return await PaymentRepository.getPaidPaymentsByStudentId(studentIds);
}

const getPaymentRecords = async (filters, page, limit) => {
    return await PaymentRepository.getPaymentRecords(filters, page, limit);
};

const getPaymentDetail = async (id) => {
    return await PaymentRepository.getPaymentById(id);
};

const getTransactionHistory = async (filters, page, limit) => {
    return await PaymentRepository.getTransactionHistory(filters, page, limit);
};

module.exports = {
    UpdatePaymentByVnPay,
    createPayment,
    getPaymentsByParentId,
    getPaidPaymentsByStudentId,
    getPaymentRecords,
    getPaymentDetail,
    getTransactionHistory
}