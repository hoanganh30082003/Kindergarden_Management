const ClassService = require('../service/ClassService');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassService.getAllClasses();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const newClass = await ClassService.createClass(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const result = await ClassService.deleteClass(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 