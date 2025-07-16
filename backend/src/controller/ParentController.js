const ParentService = require('../service/ParentService');

exports.getAllParents = async (req, res) => {
  try {
    const parents = await ParentService.getAllParents();
    res.json(parents);
  } catch (err) {
    console.error("Error fetching parents:", err);
    res.status(500).json({ error: "Failed to fetch parents" });
  }
};

exports.createParent = async (req, res) => {
  try {
    const result = await ParentService.createParent(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating parent:", err);
    res.status(400).json({ error: err.message, details: err });
  }
};

exports.updateParent = async (req, res) => {
  try {
    const updatedParent = await ParentService.updateParent(req.params.id, req.body);
    res.json(updatedParent);
  } catch (err) {
    console.error("Error updating parent:", err);
    res.status(400).json({ error: "Failed to update parent" });
  }
};

exports.deleteParent = async (req, res) => {
  try {
    const result = await ParentService.deleteParent(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting parent:", err);
    res.status(500).json({ error: "Failed to delete parent" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const result = await ParentService.updateStatus(req.params.id, req.body.status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
