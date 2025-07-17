const express = require('express');
const router = express.Router();
const ClassController = require('../controller/ClassController');
const authenticateToken = require('../middlewares/AuthMiddleware'); 
router.get('/my-classes', authenticateToken, ClassController.getMyClasses);
router.get('/', ClassController.getAllClasses);
router.post('/create', ClassController.createClass);
router.delete('/delete/:id', ClassController.deleteClass);

module.exports = router;
