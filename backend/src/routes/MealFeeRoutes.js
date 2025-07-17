const express = require('express');
const router = express.Router();
const MealFeeController = require('../controller/MealFeeController');

router.get('/', MealFeeController.getAllMealFees);
router.post('/create', MealFeeController.createMealFee);
router.put('/update/:id', MealFeeController.updateMealFeeStatus);
router.delete('/delete/:id', MealFeeController.deleteMealFee);

module.exports = router;
