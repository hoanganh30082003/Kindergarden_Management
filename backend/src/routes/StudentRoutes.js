const express = require('express');
const router = express.Router();
const studentController = require('../controller/StudentController');
const authenticateToken = require('../middlewares/AuthMiddleware');

router.get('/by-class/:classId', authenticateToken, studentController.getStudentsByClass);
router.get('/', studentController.getAllStudents);
router.post('/create', studentController.createStudent);
router.put('/update/:id', studentController.updateStudent);
router.delete('/delete/:id', studentController.deleteStudent);

module.exports = router;
