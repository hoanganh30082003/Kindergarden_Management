const express = require('express');
const router = express.Router();
const ClassController = require('../controller/ClassController');

router.get('/', ClassController.getAllClasses);
router.post('/create', ClassController.createClass);
router.delete('/delete/:id', ClassController.deleteClass);

module.exports = router;
