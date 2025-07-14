

const express = require('express');
const router = express.Router();
const ClassTimetableController = require('../controller/ClassTimetableController');
const authenticateToken = require('../middlewares/AuthMiddleware');


router.get('/my-schedule', authenticateToken, ClassTimetableController.getMySchedule);

module.exports = router;