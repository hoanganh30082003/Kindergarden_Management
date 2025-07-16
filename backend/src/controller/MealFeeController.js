const MealFeeService = require('../service/MealFeeService');

exports.getAllMealFees = async (req, res) => {
  try {
    const meals = await MealFeeService.getAllMealFees();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMealFee = async (req, res) => {
  try {
    const meal = await MealFeeService.createMealFee(req.body);
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMealFeeStatus = async (req, res) => {
  try {
    const updated = await MealFeeService.updateMealFeeStatus(req.params.id, req.body.payment_status);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMealFee = async (req, res) => {
  try {
    const result = await MealFeeService.deleteMealFee(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 