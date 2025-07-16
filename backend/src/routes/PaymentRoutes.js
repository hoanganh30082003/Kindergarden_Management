const express = require('express');
const router = express.Router();
const paymentController = require('../controller/PaymentController');
const authenticateToken = require('../middlewares/AuthMiddleware');

router.post('/create_payment_url', paymentController.createPaymentUrl);
router.get('/vnpay_return', paymentController.vnpayReturn);
router.post('/create',paymentController.createPayment)
// router.get('/detail/:id', paymentController.getPaymentDetail);
router.get('/history', paymentController.getTransactionHistory);
router.get('/:parentId', paymentController.getPaymentsByParentId);
router.get('/records', authenticateToken, paymentController.getPaymentRecords);
router.get('/detail/:id', authenticateToken, paymentController.getPaymentDetail);
router.get('/transactions', authenticateToken, paymentController.getTransactionHistory);

module.exports = router;
