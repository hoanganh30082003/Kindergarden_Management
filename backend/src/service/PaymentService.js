const PaymentRepository = require('../repositories/PaymentRepository')
const StudentModel = require('../model/StudentModel');
const ParentModel = require('../model/ParentModel');

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

const getPaymentsByParentId = async (accountId) => {
  // Truy vấn sang bảng Parent để lấy parent id
  const parent = await ParentModel.findOne({ account_id: accountId });
  if (!parent) throw new Error('Parent not found for this account');
  // Lấy danh sách student thuộc parent
  const students = await StudentModel.find({ parent_id: parent._id });
  const studentIds = students.map(s => s._id);
  // Lấy payment theo studentIds
  return await PaymentRepository.findByStudentIds(studentIds);
};

const getPaidPaymentsByStudentId = async (accountId) =>{
    const parent = await ParentModel.findOne({ account_id: accountId });
  if (!parent) throw new Error('Parent not found for this account');
  // Lấy danh sách student thuộc parent
  const students = await StudentModel.find({ parent_id: parent._id });
  const studentIds = students.map(s => s._id);
  // Lấy payment theo studentIds
  return await PaymentRepository.getPaidPaymentsByStudentId(studentIds);
}
module.exports = {
    UpdatePaymentByVnPay,
    createPayment,
    getPaymentsByParentId,
    getPaidPaymentsByStudentId
}