const express = require('express');
const router = express.Router();
const studentController = require('../controller/StudentController');
const authenticateToken = require('../middlewares/AuthMiddleware');

router.get('/by-class/:classId', authenticateToken, studentController.getStudentsByClass);
router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
