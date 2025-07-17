const express = require('express');
const router = express.Router();
const FeeController = require('../controller/TuitionFeeController');

router.get('/', FeeController.getAllFees);
router.post('/create', FeeController.createFee);
router.put('/update/:id', FeeController.updateFee);
router.delete('/delete/:id', FeeController.deleteFee);

module.exports = router;
