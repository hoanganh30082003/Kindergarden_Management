const express = require('express');
const router = express.Router();
const ParentController = require('../controller/ParentController');
const authenticateToken = require('../middlewares/AuthMiddleware')

router.get('/', ParentController.getAllParents);
router.post('/create', ParentController.createParent);
router.get('/:accountId', authenticateToken, ParentController.getParentByAccountId);
router.put('/update/:id', ParentController.updateParent);
router.delete('/delete/:id', ParentController.deleteParent);

module.exports = router;
