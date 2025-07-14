const PaymentRepository = require('../repositories/PaymentRepository');

const getPaymentRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, payment_type, method, status, student_id, class_id } = req.query;
    
    const filters = {};
    if (payment_type) filters.payment_type = payment_type;
    if (method) filters.method = method;
    if (status) filters.status = status;
    if (student_id) filters.student_id = student_id;
    if (class_id) filters.class_id = class_id;

    const result = await PaymentRepository.getPaymentRecords(filters, page, limit);
    
    res.json({
      success: true,
      data: result.payments,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getPaymentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await PaymentRepository.getPaymentById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      start_date, 
      end_date, 
      class_id, 
      student_id,
      payment_type,
      method
    } = req.query;
    
    const filters = {};
    if (start_date || end_date) {
      filters.payment_date = {};
      if (start_date) filters.payment_date.$gte = new Date(start_date);
      if (end_date) filters.payment_date.$lte = new Date(end_date);
    }
    if (class_id) filters.class_id = class_id;
    if (student_id) filters.student_id = student_id;
    if (payment_type) filters.payment_type = payment_type;
    if (method) filters.method = method;

    const result = await PaymentRepository.getTransactionHistory(filters, page, limit);
    
    res.json({
      success: true,
      data: result.transactions,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getPaymentRecords,
  getPaymentDetail,
  getTransactionHistory
};