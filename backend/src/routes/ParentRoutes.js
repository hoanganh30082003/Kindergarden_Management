const express = require('express');
const router = express.Router();
const ParentController = require('../controller/ParentController');
const authenticateToken = require('../middlewares/AuthMiddleware')

router.get('/:accountId',authenticateToken, ParentController.getParentByAccountId);
module.exports = router;