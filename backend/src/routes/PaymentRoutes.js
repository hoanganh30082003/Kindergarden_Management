const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.post('/create_payment_url', paymentController.createPaymentUrl);
router.get('/vnpay_return', paymentController.vnpayReturn);
router.post('/create',paymentController.createPayment)
router.get('/detail/:id', paymentController.getPaymentDetail);
router.get('/history', paymentController.getTransactionHistory);
router.get('/:parentId', paymentController.getPaymentsByParentId);
module.exports = router;
