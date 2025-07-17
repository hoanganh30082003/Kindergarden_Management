

const express = require('express');
const router = express.Router();
const ClassTimetableController = require('../controller/ClassTimetableController');
const authenticateToken = require('../middlewares/AuthMiddleware');


router.get('/my-schedule', authenticateToken, ClassTimetableController.getMySchedule);
router.get('/by-parent/:parentId', authenticateToken, ClassTimetableController.getScheduleForParent);

module.exports = router;