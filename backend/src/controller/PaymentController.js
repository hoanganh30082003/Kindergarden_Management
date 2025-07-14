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
};

const getPaymentDetail = async (req, res) => {
  try {
    const payment = await paymentRepository.getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ data: payment });
  } catch (error) {
    console.error('Error getting payment detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTransactionHistory = async (req, res) => {
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
module.exports = {
    createPaymentUrl,
    vnpayReturn,
    createPayment,
    getPaymentsByParentId,
    getPaymentDetail,
    getTransactionHistory
}