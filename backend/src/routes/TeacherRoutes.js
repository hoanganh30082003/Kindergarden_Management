const express = require('express');
const router = express.Router();
const TeacherController = require('../controller/TeacherController');

router.get('/by-account/:accountId', TeacherController.getTeacherByAccountId);
router.get('/', TeacherController.getAllTeachers);
router.post('/create', TeacherController.createTeacher);
router.put('/update/:id',TeacherController.updateTeacher);
router.delete('/delete/:id',TeacherController.deleteTeacher);
module.exports = router;
