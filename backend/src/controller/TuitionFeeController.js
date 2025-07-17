const FeeService = require('../service/FeeService');

exports.getAllFees = async (req, res) => {
  try {
    const fees = await FeeService.getAllFees();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fees' });
  }
};

exports.createFee = async (req, res) => {
  try {
    const fee = await FeeService.createFee(req.body);
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const updated = await FeeService.updateFee(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const result = await FeeService.deleteFee(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 