const express = require('express');
const router = express.Router();
const TeacherController = require('../controller/TeacherController');

router.get('/by-account/:accountId', TeacherController.getTeacherByAccountId);

module.exports = router;
