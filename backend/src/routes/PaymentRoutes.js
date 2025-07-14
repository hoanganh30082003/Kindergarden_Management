const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/PaymentController');
const authenticateToken = require('../middlewares/AuthMiddleware');

router.get('/records', authenticateToken, PaymentController.getPaymentRecords);

router.get('/detail/:id', authenticateToken, PaymentController.getPaymentDetail);

router.get('/transactions', authenticateToken, PaymentController.getTransactionHistory);

module.exports = router;