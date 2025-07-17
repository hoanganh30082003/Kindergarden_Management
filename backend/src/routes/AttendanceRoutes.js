const express = require('express');
const router = express.Router();
const AttendanceController = require('../controller/AttendanceController');
const authenticateToken = require('../middlewares/AuthMiddleware');

router.post('/record', authenticateToken, AttendanceController.record);
router.get('/view/:classId/:date', authenticateToken, AttendanceController.view);

module.exports = router;