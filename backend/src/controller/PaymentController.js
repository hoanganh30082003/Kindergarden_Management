const vnpayService = require('../service/VnPayService');
const paymentService = require('../service/PaymentService')
const paymentRepository = require('../repositories/PaymentRepository');

const createPaymentUrl = async (req, res) => {
  try {
    const response = await vnpayService.createPaymentUrl(req);
    res.json({ redirectUrl: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const vnpayReturn = async (req, res) => {
  try {
    const result = await vnpayService.verifyReturnUrl(req);
    // Điều hướng về trang payment và truyền message qua query string
    if (result.success) {
      res.redirect(`http://localhost:5000/payment?alert=${encodeURIComponent(result.message)}`);
    } else {
      res.redirect(`http://localhost:5000/payment?alert=${encodeURIComponent(result.message)}`);
    }
  } catch (error) {
    console.error(error);
    res.redirect(`http://localhost:5000/payment?alert=${encodeURIComponent('Thanh toán thất bại')}`);
  }
};
const createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getPaymentsByParentId = async (req, res) => {
  try {
    const payments = await paymentService.getPaymentsByParentId(req.params.parentId);
    res.json({ data: payments });
  } catch (error) {
    console.error('Error getting payments by parent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
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

const getParentTransactionHistory = async (req, res) => {
  try {
    const { accountId } = req.query;
    if (!accountId) return res.status(400).json({ error: 'Missing accountId' });
    const payments = await paymentService.getPaidPaymentsByStudentId(accountId);
    res.json({ data: payments });
  } catch (error) {
    console.error('Error getting payments by parent:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  getTransactionHistory,
  createPaymentUrl,
  vnpayReturn,
  createPayment,
  getPaymentsByParentId,
  getPaymentDetail,
  getParentTransactionHistory
};
