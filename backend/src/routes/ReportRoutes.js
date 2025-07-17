const express = require('express');
const router = express.Router();
const ReportController = require('../controller/ReportController');
const authenticateToken = require('../middlewares/AuthMiddleware');

router.get('/tuition', authenticateToken, ReportController.getTuitionReports);

router.get('/meal-fee', authenticateToken, ReportController.getMealFeeReports);

module.exports = router;